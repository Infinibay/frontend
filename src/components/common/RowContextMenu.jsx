'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MenuItem, MenuLabel, MenuSeparator, Z } from '@infinibay/harbor';
import { focusFirst, focusNextMenuItem } from '@infinibay/harbor/a11y';

/**
 * RowContextMenu — wraps a child (typically a DataTable) and shows a
 * right-click menu over its rows.
 *
 * Row resolution is by STABLE ID, not DOM position: Harbor's DataTable stamps
 * every rendered row with `data-row-id` (its `rowId(row)`), and we look the row
 * up in `rows` by that id. This is critical — DataTable sorts/filters/paginates
 * internally, so the rendered order (aria-rowindex) does NOT match the caller's
 * `rows` array order; the previous index-based mapping resolved the WRONG row
 * once a table was sorted or paged, so a right-click "Delete" could hit a
 * different record than the one clicked. A positional fallback remains only for
 * legacy `<tbody><tr>` tables that don't stamp an id.
 *
 * Props:
 *   rows               — same array passed to DataTable
 *   rowId(row)         — id accessor matching the one given to DataTable
 *                        (default `row.id`); used to match `data-row-id`
 *   buildItems(row)    — returns an array of { label, icon?, danger?, disabled?, onSelect }
 *                        or null/undefined to suppress the menu for that row
 *   labelFor(row)      — optional title shown at the top of the menu
 */
export function RowContextMenu({
  rows,
  rowId = (r) => r?.id,
  buildItems,
  labelFor,
  children,
}) {
  const wrapRef = useRef(null);
  const menuRef = useRef(null);
  // Element that had focus when the menu opened, so keyboard users are returned
  // to where they were after the menu closes (parity with a native menu).
  const restoreFocusRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  // Close and, when asked, restore focus to the element that opened the menu.
  // Item selection passes restore=false because the selected action typically
  // moves focus itself (opens a dialog / navigates) and we must not steal it.
  function closeMenu(restore = true) {
    setCtx(null);
    const el = restoreFocusRef.current;
    restoreFocusRef.current = null;
    if (restore && el && typeof el.focus === 'function') {
      // Defer past the portal unmount so the focus target is back in the DOM.
      requestAnimationFrame(() => el.focus());
    }
  }

  useEffect(() => {
    if (!ctx) return;
    // Move focus into the menu on open so it's operable by keyboard.
    const raf = requestAnimationFrame(() => {
      if (menuRef.current) focusFirst(menuRef.current);
    });
    function down(e) {
      if (!menuRef.current?.contains(e.target)) closeMenu();
    }
    function key(e) {
      if (e.key === 'Escape') closeMenu();
    }
    // The menu is position:fixed at the cursor point; if the page (or any
    // scroll container) scrolls it would drift away from its row, so close it.
    function onScroll() {
      closeMenu();
    }
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousedown', down);
      document.removeEventListener('keydown', key);
      window.removeEventListener('scroll', onScroll, true);
    };
     
  }, [ctx]);

  function onMenuKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusNextMenuItem(menuRef.current, 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusNextMenuItem(menuRef.current, -1);
    }
  }

  function onContextMenu(e) {
    // Harbor's DataTable renders rows as <div role="row"> (CSS grid),
    // not <tbody><tr>. Header has aria-rowindex="1"; data rows start at 2.
    const rowEl = e.target.closest('[role="row"]');
    if (!rowEl || !wrapRef.current?.contains(rowEl)) return;

    let row;
    // Preferred: resolve by the stable id DataTable stamps on each row. This is
    // immune to internal sort/filter/pagination reordering.
    const domRowId = rowEl.getAttribute('data-row-id');
    if (domRowId != null) {
      row = (rows || []).find((r) => String(rowId(r)) === domRowId);
    } else {
      // Fallback for tables that don't stamp an id (legacy <tbody><tr> or a
      // DataTable version without data-row-id): map by position. Only sound
      // when the rendered order matches the `rows` order (no internal sort).
      const ariaIdx = rowEl.getAttribute('aria-rowindex');
      let idx = -1;
      if (ariaIdx && ariaIdx !== '1') {
        idx = parseInt(ariaIdx, 10) - 2;
      } else if (!ariaIdx) {
        const tr = e.target.closest('tbody tr');
        if (tr && wrapRef.current.contains(tr)) {
          const allRows = Array.from(
            wrapRef.current.querySelectorAll('tbody tr')
          );
          idx = allRows.indexOf(tr);
        }
      }
      row = rows?.[idx];
    }
    if (!row) return;
    const items = buildItems(row);
    if (!items || !items.length) return;
    e.preventDefault();
    let x = e.clientX;
    let y = e.clientY;
    const W = 220;
    const H = 40 + items.length * 36;
    if (x + W > window.innerWidth - 8) x = window.innerWidth - W - 8;
    if (y + H > window.innerHeight - 8) y = window.innerHeight - H - 8;
    // Remember where focus was so we can restore it on close.
    if (typeof document !== 'undefined') {
      restoreFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
    setCtx({ x, y, row, items });
  }

  return (
    <div ref={wrapRef} onContextMenu={onContextMenu}>
      {children}
      {ctx && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              aria-label="Row actions"
              tabIndex={-1}
              onKeyDown={onMenuKeyDown}
              style={{
                position: 'fixed',
                left: ctx.x,
                top: ctx.y,
                zIndex: Z.CONTEXT_MENU,
                minWidth: 200,
              }}
              className="rounded-md bg-surface-2 border border-[color:var(--harbor-overlay-border)] shadow-harbor-lg p-1 focus:outline-none"
            >
              {labelFor ? (
                <>
                  <MenuLabel>{labelFor(ctx.row)}</MenuLabel>
                  <MenuSeparator />
                </>
              ) : null}
              {ctx.items.map((it, i) =>
                it.separator ? (
                  <MenuSeparator key={`sep-${i}`} />
                ) : (
                  <MenuItem
                    key={i}
                    icon={it.icon}
                    danger={it.danger}
                    disabled={it.disabled}
                    onClick={() => {
                      const row = ctx.row;
                      // Don't restore focus: the selected action typically takes
                      // focus itself (dialog/navigation).
                      closeMenu(false);
                      it.onSelect?.(row);
                    }}
                  >
                    {it.label}
                  </MenuItem>
                )
              )}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
