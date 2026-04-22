'use client';

/**
 * NotificationBell Component
 *
 * Displays a bell icon with a badge showing pending recommendations count.
 * Opens a dropdown with the list of recommendations.
 */

import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { IconButton } from '@infinibay/harbor';
import { useGetPendingRecommendationCountQuery } from '@/gql/hooks';
import { RecommendationDropdown } from './RecommendationDropdown';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Poll every 30 seconds for new recommendations
  const { data, refetch } = useGetPendingRecommendationCountQuery({
    pollInterval: 30000,
  });

  const count = data?.pendingRecommendationCount ?? 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const badgeStyle = {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    padding: '0 5px',
    borderRadius: 9999,
    background: 'rgb(239, 68, 68)',
    color: 'white',
    fontSize: 11,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    pointerEvents: 'none',
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <IconButton
        variant="ghost"
        size="sm"
        icon={<Bell size={16} />}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`${count} recomendaciones pendientes`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      />
      {count > 0 && (
        <span style={badgeStyle}>{count > 99 ? '99+' : count}</span>
      )}

      {isOpen && (
        <RecommendationDropdown
          onClose={() => setIsOpen(false)}
          onActionComplete={() => refetch()}
        />
      )}
    </div>
  );
}

export default NotificationBell;
