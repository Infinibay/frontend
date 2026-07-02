"use client";

export default function ApplicationsLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {children}
    </div>
  );
}
