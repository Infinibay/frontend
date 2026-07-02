'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Z } from '@infinibay/harbor';

/**
 * Thin accent-gradient progress bar pinned at the top of the viewport.
 * Starts trickling on any internal link click and completes when the
 * pathname actually changes. No dependency, no skeleton — the bar is
 * the only thing that tells the user *"something is happening"*.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(0);
  const stallTimerRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      // Ignore clicks another handler already consumed (e.g. a programmatic
      // download that called preventDefault, or a router intercept).
      if (e.defaultPrevented) return;
      const a = e.target.closest?.('a[href]');
      if (!a) return;
      // Downloads (openSpiceClient appends <a download href="blob:…"> and
      // clicks it) never navigate — bubbling this into the trickle would hang
      // the bar at 85% forever.
      if (a.hasAttribute('download')) return;
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;
      // Non-navigating schemes: external links, blob/data downloads, tel:, etc.
      if (/^(https?|blob|data|tel):/i.test(href)) return;
      if (a.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey) return;
      // Same pathname — no navigation
      if (href === pathname) return;

      setVisible(true);
      setProgress(8);
      startRef.current = performance.now();
      const tick = () => {
        setProgress((p) => {
          // Ease toward 85%, never hit 100% until pathname changes.
          const next = p + (85 - p) * 0.04;
          return next < 85 ? next : 85;
        });
        rafRef.current = requestAnimationFrame(tick);
      };
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);

      // Safety net: if the pathname never changes (SPA navigation cancelled,
      // same-route link, or a click we misjudged as a nav), stop the loop and
      // hide the bar instead of trickling forever.
      clearTimeout(stallTimerRef.current);
      stallTimerRef.current = setTimeout(() => {
        cancelAnimationFrame(rafRef.current);
        setVisible(false);
        setProgress(0);
      }, 8000);
    }
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(stallTimerRef.current);
    };
  }, [pathname]);

  // Pathname changed → complete the bar and fade out.
  // Intentional setState inside effect: the progress bar is driven by
  // external events (pathname change), not by data in render. Snapping
  // to 100 and then to 0 after a timeout is the whole point.
   
  useEffect(() => {
    if (!visible) return;
    cancelAnimationFrame(rafRef.current);
    clearTimeout(stallTimerRef.current);
    setProgress(100);
    const fadeTimer = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 220);
    return () => clearTimeout(fadeTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
   

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: Z.CHROME,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 180ms ease-out',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background:
            'linear-gradient(90deg, rgb(var(--harbor-accent)) 0%, rgb(var(--harbor-accent-2)) 100%)',
          boxShadow:
            '0 0 8px rgb(var(--harbor-accent) / 0.6), 0 0 16px rgb(var(--harbor-accent-2) / 0.3)',
          transition: 'width 120ms linear',
        }}
      />
    </div>
  );
}
