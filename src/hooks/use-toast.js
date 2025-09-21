import * as React from 'react';

const TOAST_LIMIT = 5; // Allow up to 5 stacked toasts
const TOAST_REMOVE_DELAY = 1000; // 1 second delay before removing from DOM
const TOAST_AUTO_DISMISS_DELAY = 4000; // 4 seconds TTL for auto-dismiss

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toastTimeouts = new Map();
const autoDismissTimeouts = new Map();

const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

const addToAutoDismissQueue = (toastId, duration = TOAST_AUTO_DISMISS_DELAY) => {
  if (autoDismissTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    autoDismissTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.DISMISS_TOAST,
      toastId: toastId,
    });
  }, duration);

  autoDismissTimeouts.set(toastId, timeout);
};

const clearAutoDismissTimeout = (toastId) => {
  if (autoDismissTimeouts.has(toastId)) {
    clearTimeout(autoDismissTimeouts.get(toastId));
    autoDismissTimeouts.delete(toastId);
  }
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        // Clear all timeouts
        toastTimeouts.forEach((timeout) => clearTimeout(timeout));
        autoDismissTimeouts.forEach((timeout) => clearTimeout(timeout));
        toastTimeouts.clear();
        autoDismissTimeouts.clear();
        return {
          ...state,
          toasts: [],
        };
      }
      // Clear timeouts for this specific toast
      clearAutoDismissTimeout(action.toastId);
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners = [];

let memoryState = { toasts: [] };

function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function toast({ duration, ...props }) {
  const id = genId();

  const update = (props) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });
  const dismiss = () => {
    clearAutoDismissTimeout(id);
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
  };

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  // Start auto-dismiss timer unless duration is 0 or Infinity
  if (duration !== 0 && duration !== Infinity) {
    addToAutoDismissQueue(id, duration);
  }

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

// Utility functions for common toast patterns
const toastSuccess = (props) => toast({ variant: 'success', duration: TOAST_AUTO_DISMISS_DELAY, ...props });
const toastError = (props) => toast({ variant: 'destructive', duration: TOAST_AUTO_DISMISS_DELAY * 1.5, ...props }); // Error toasts stay longer
const toastInfo = (props) => toast({ variant: 'default', duration: TOAST_AUTO_DISMISS_DELAY, ...props });
const toastPersistent = (props) => toast({ duration: Infinity, ...props }); // Manual dismiss only

export { useToast, toast, toastSuccess, toastError, toastInfo, toastPersistent };
