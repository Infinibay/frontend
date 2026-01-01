'use client';

/**
 * NotificationBell Component
 *
 * Displays a bell icon with a badge showing pending recommendations count.
 * Opens a dropdown with the list of recommendations.
 */

import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetPendingRecommendationCountQuery } from '@/gql/hooks';
import { RecommendationDropdown } from './RecommendationDropdown';
import { cn } from '@/lib/utils';

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

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`${count} recomendaciones pendientes`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="h-5 w-5" />

        {/* Badge */}
        {count > 0 && (
          <span
            className={cn(
              'absolute -top-1 -right-1 flex items-center justify-center',
              'min-w-[18px] h-[18px] px-1 rounded-full',
              'text-xs font-medium text-white',
              'bg-destructive',
              'animate-in zoom-in-50 duration-200'
            )}
          >
            {count > 99 ? '99+' : count}
          </span>
        )}
      </Button>

      {/* Dropdown */}
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
