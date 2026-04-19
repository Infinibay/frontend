"use client";
import PropTypes from "prop-types";

/** Stub. Legacy "selected apps" side panel used by app-store-installer. */
export function SelectedAppsPanel({ apps = [], onRemove }) {
  if (apps.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-surface-1 p-4 text-xs text-fg-muted">
        No apps selected yet.
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-white/10 bg-surface-1 p-2 space-y-1">
      {apps.map((app) => (
        <div
          key={app.id || app.name}
          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5"
        >
          <div className="text-sm text-fg truncate flex-1">{app.name}</div>
          <button
            type="button"
            onClick={() => onRemove?.(app)}
            className="text-xs text-fg-subtle hover:text-danger"
          >
            remove
          </button>
        </div>
      ))}
    </div>
  );
}

SelectedAppsPanel.propTypes = {
  apps: PropTypes.array,
  onRemove: PropTypes.func,
};
