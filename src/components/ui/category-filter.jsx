"use client";
import PropTypes from "prop-types";

export function CategoryFilter({ categories = [], selected, onSelect }) {
  const items = [{ value: "all", label: "All" }, ...categories].map((c) =>
    typeof c === "string" ? { value: c, label: c } : c
  );

  return (
    <div className="flex gap-1.5 flex-wrap">
      {items.map((item) => {
        const active = item.value === selected;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onSelect?.(item.value)}
            className={
              active
                ? "px-2.5 py-1 text-xs rounded-full bg-accent/20 text-accent border border-accent/40 inline-flex items-center gap-1.5"
                : "px-2.5 py-1 text-xs rounded-full bg-surface-1 text-fg-muted border border-white/10 hover:text-fg inline-flex items-center gap-1.5"
            }
          >
            {item.label}
            {typeof item.count === "number" && (
              <span className="text-fg-subtle tabular-nums">{item.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

CategoryFilter.propTypes = {
  categories: PropTypes.array,
  selected: PropTypes.string,
  onSelect: PropTypes.func,
};
