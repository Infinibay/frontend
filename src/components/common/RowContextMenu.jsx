'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MenuItem, MenuLabel, MenuSeparator } from '@infinibay/harbor';

/**
 * RowContextMenu — wraps a child (typically a DataTable) and shows a
 * right-click menu over `tbody tr` rows. Uses row index → rows[idx] mapping
 * because Harbor's DataTable doesn't expose row identifiers in the DOM.
 *
 * Props:
 *   rows               — same array passed to DataTable; index match required
 *   buildItems(row)    — returns an array of { label, icon?, danger?, disabled?, onSelect }
 *                        or null/undefined to suppress the menu for that row
 *   labelFor(row)      — optional title shown at the top of the menu
 */
export function RowContextMenu({ rows, buildItems, labelFor, children }) {
  const wrapRef = useRef(null);
  const menuRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    if (!ctx) return;
    function down(e) {
      if (!menuRef.current?.contains(e.target)) setCtx(null);
    }
    function key(e) {
      if (e.key === 'Escape') setCtx(null);
    }
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('mousedown', down);
      document.removeEventListener('keydown', key);
    };
  }, [ctx]);

  function onContextMenu(e) {
    // Harbor's DataTable renders rows as <div role="row"> (CSS grid),
    // not <tbody><tr>. Header has aria-rowindex="1"; data rows start at 2.
    const rowEl = e.target.closest('[role="row"]');
    if (!rowEl || !wrapRef.current?.contains(rowEl)) return;
    const ariaIdx = rowEl.getAttribute('aria-rowindex');
    let idx = -1;
    if (ariaIdx && ariaIdx !== '1') {
      idx = parseInt(ariaIdx, 10) - 2;
    } else if (!ariaIdx) {
      // Fallback for legacy <tbody><tr> tables
      const tr = e.target.closest('tbody tr');
      if (tr && wrapRef.current.contains(tr)) {
        const allRows = Array.from(
          wrapRef.current.querySelectorAll('tbody tr')
        );
        idx = allRows.indexOf(tr);
      }
    }
    const row = rows[idx];
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
    setCtx({ x, y, row, items });
  }

  return (
    <div ref={wrapRef} onContextMenu={onContextMenu}>
      {children}
      {ctx && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={menuRef}
              style={{
                position: 'fixed',
                left: ctx.x,
                top: ctx.y,
                zIndex: 9999,
                minWidth: 200,
              }}
              className="rounded-xl bg-[#14141c] border border-white/10 shadow-2xl p-1"
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
                      setCtx(null);
                      it.onSelect?.(ctx.row);
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
