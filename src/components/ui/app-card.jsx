"use client";
import PropTypes from "prop-types";

/** Stub. Legacy application tile used by app-store-installer. */
export function AppCard({ app, selected, onToggle }) {
  if (!app) return null;
  return (
    <button
      type="button"
      onClick={() => onToggle?.(app)}
      className={
        selected
          ? "w-full flex items-center gap-3 rounded-lg border border-accent/50 bg-accent/10 px-3 py-2 text-left"
          : "w-full flex items-center gap-3 rounded-lg border border-white/10 bg-surface-1 hover:border-white/20 px-3 py-2 text-left"
      }
    >
      {app.icon ? (
        <img src={app.icon} alt="" className="h-8 w-8 rounded" />
      ) : (
        <div className="h-8 w-8 rounded bg-surface-2" />
      )}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-fg truncate">{app.name}</div>
        {app.description ? (
          <div className="text-xs text-fg-muted truncate">{app.description}</div>
        ) : null}
      </div>
    </button>
  );
}

AppCard.propTypes = {
  app: PropTypes.object,
  selected: PropTypes.bool,
  onToggle: PropTypes.func,
};
