"use client";

import React from "react";

export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <button
          className="mb-4 inline-flex items-center rounded-md border border-zinc-100 bg-zinc-50 px-3 py-1 text-sm text-zinc-600"
          onClick={onClose}
        >
          Close
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
}
