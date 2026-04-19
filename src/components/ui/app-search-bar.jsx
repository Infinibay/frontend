"use client";
import PropTypes from "prop-types";

/** Stub. Legacy search bar used by app-store-installer. */
export function AppSearchBar({ value, onChange, placeholder = "Search…" }) {
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg bg-surface-1 border border-white/10 px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent-2/40"
    />
  );
}

AppSearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};
