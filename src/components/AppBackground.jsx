"use client"

import React from "react";

export function AppBackground() {
  return (
    <div className="app-bg" aria-hidden="true">
      <span className="app-bg__blob app-bg__blob--1" />
      <span className="app-bg__blob app-bg__blob--2" />
      <span className="app-bg__blob app-bg__blob--3" />
      <span className="app-bg__blob app-bg__blob--4" />
      <span className="app-bg__grain" />
    </div>
  );
}
