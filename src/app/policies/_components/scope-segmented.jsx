import { PermissionScope } from '@/gql/graphql';
import { NONE } from './policy-helpers';

// Compact segmented scope picker — replaces the bulky per-verb dropdowns. Reads
// left→right as widening reach (— ⊂ Own ⊂ Dept ⊂ Any). Global (unscoped)
// resources collapse to Off / On. Extracted verbatim — no behaviour change.
export const ScopeSegmented = ({ value, scoped, disabled = false, onChange, ariaLabel }) => {
  const segments = scoped
    ? [
        { value: NONE, label: '—', hint: 'No access' },
        { value: PermissionScope.Own, label: 'Own', hint: 'Own resources only' },
        { value: PermissionScope.Department, label: 'Dept', hint: 'Whole department' },
        { value: PermissionScope.Any, label: 'Any', hint: 'Anywhere' }]
    : [
        { value: NONE, label: 'Off', hint: 'No access' },
        { value: PermissionScope.Any, label: 'On', hint: 'Granted' }];

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex shrink-0 select-none rounded border border-white/10 bg-surface-1 p-0.5 ${
        disabled ? 'opacity-60' : ''
      }`}>
      {segments.map((seg) => {
        const active = value === seg.value;
        return (
          <button
            key={seg.value}
            type="button"
            title={seg.hint}
            aria-pressed={active}
            disabled={disabled}
            onClick={() => onChange?.(seg.value)}
            className={`min-w-[2.25rem] rounded-[3px] px-2.5 py-1 text-xs font-medium transition-colors ${
              active ? 'bg-accent text-white shadow-sm' : 'text-fg-muted hover:bg-white/5 hover:text-fg'
            } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            {seg.label}
          </button>
        );
      })}
    </div>
  );
};
