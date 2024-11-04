import React, { useEffect } from 'react';
// Import icons from react-icons
import { FiInfo, FiAlertTriangle, FiXCircle } from 'react-icons/fi';

const Modal = ({
  title,
  type = 'information', // 'warning', 'error', 'custom'
  onAccept,
  onCancel,
  onReject,
  darkOverlay = false,
  blur = false,
  show = false,
  children,
  acceptText = 'Accept',
  cancelText = 'Cancel',
  rejectText = 'Reject',
  showIcon = true,
  ...props
}) => {
  // Move useState outside of useEffect
  const [realShow, setRealShow] = React.useState(show);

  useEffect(() => {
    setRealShow(show);
  }, [show]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (onCancel) onCancel();
        else if (onReject) onReject();
      }
    };
    if (realShow) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [realShow, onCancel, onReject]);

  // Determine the icon and color based on type
  let IconComponent = null;
  let iconColor = '';

  if (showIcon) {
    if (type === 'information') {
      IconComponent = FiInfo;
      iconColor = 'text-blue-500';
    } else if (type === 'warning') {
      IconComponent = FiAlertTriangle;
      iconColor = 'text-yellow-500';
    } else if (type === 'error') {
      IconComponent = FiXCircle;
      iconColor = 'text-red-500';
    }
  }

  if (!realShow) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${darkOverlay ? 'bg-gray-800 bg-opacity-75' : ''
        } ${blur ? 'backdrop-blur-sm' : ''}`}
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl p-6 max-w-lg w-full ${type === 'warning'
          ? 'border-l-4 border-yellow-500'
          : type === 'error'
            ? 'border-l-4 border-red-500'
            : type === 'information'
              ? 'border-l-4 border-blue-500'
              : ''
          }`}
        {...props}
      >
        {title && (
          <div className="mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
        )}
        <div className={`mb-4 ${IconComponent ? 'flex' : ''}`}>
          {IconComponent && (
            <div className="mr-4 flex-shrink-0">
              <IconComponent className={`w-16 h-16 ${iconColor}`} />
            </div>
          )}
          <div>{children}</div>
        </div>
        <div className="flex justify-end space-x-2">
          {onAccept && (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow"
              onClick={onAccept}
            >
              {acceptText}
            </button>
          )}
          {onCancel && (
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}
          {onReject && (
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow"
              onClick={onReject}
            >
              {rejectText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
