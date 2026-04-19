"use client";
import PropTypes from "prop-types";

/** Stub. Legacy category chip row used by app-store-installer. */
export function CategoryFilter({ categories = [], selected, onSelect }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {categories.map((c) => {
        const active = c === selected;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onSelect?.(c)}
            className={
              active
                ? "px-2.5 py-1 text-xs rounded-full bg-accent/20 text-accent border border-accent/40"
                : "px-2.5 py-1 text-xs rounded-full bg-surface-1 text-fg-muted border border-white/10 hover:text-fg"
            }
          >
            {c}
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
