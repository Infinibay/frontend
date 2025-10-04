import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSizeContext } from '@/components/ui/size-provider';
import { getCategoryIcon, getCategoryColor, FILTER_CATEGORIES } from '@/utils/genericFilterCategories';
import { useSafeResolvedTheme } from '@/utils/safe-theme';
import { Badge } from '@/components/ui/badge';
import { CollapsibleTrigger } from '@/components/ui/collapsible';

/**
 * CategoryHeader - Collapsible trigger for filter categories
 * Designed to be used with Collapsible component from radix-ui
 *
 * @param {Object} props
 * @param {string} props.category - Category key (e.g., 'security', 'web')
 * @param {boolean} props.isOpen - Whether category is expanded
 * @param {number} props.assignedCount - Number of assigned filters in category
 * @param {number} props.totalCount - Total number of filters in category
 * @param {string} [props.className] - Additional CSS classes
 */
export function CategoryHeader({
  category,
  isOpen,
  assignedCount,
  totalCount,
  className
}) {
  const { size } = useSizeContext();
  const theme = useSafeResolvedTheme();
  const colors = getCategoryColor(category, theme);
  const icon = getCategoryIcon(category);
  const categoryInfo = FILTER_CATEGORIES[category];

  const ChevronIcon = isOpen ? ChevronDown : ChevronRight;

  return (
    <CollapsibleTrigger asChild>
      <button
        type="button"
        className={cn(
          'w-full flex items-center justify-between',
          'glass-subtle hover:glass-medium',
          'radius-fluent-md',
          'size-padding',
          'transition-all duration-200 ease-in-out',
          'hover:elevation-1',
          'min-h-[44px]', // Accessibility: minimum touch target
          className
        )}
      >
        {/* Left side: Icon + Category name */}
        <div className="flex items-center gap-3">
          <ChevronIcon
            className={cn(
              'size-5 transition-transform',
              colors.text
            )}
          />
          <span className="text-xl" role="img" aria-hidden="true">
            {icon}
          </span>
          <span className={cn('font-semibold size-text', colors.text)}>
            {categoryInfo?.name || category}
          </span>
        </div>

        {/* Right side: Counter badge */}
        <Badge
          variant={assignedCount > 0 ? 'default' : 'secondary'}
          className="ml-2"
        >
          {assignedCount} / {totalCount}
        </Badge>
      </button>
    </CollapsibleTrigger>
  );
}
