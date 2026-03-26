"use client";

import { useState } from "react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{message}</p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 border px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg text-white text-sm font-medium ${
              destructive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useConfirm() {
  const [state, setState] = useState<{
    open: boolean;
    resolve: ((value: boolean) => void) | null;
    title: string;
    message: string;
    confirmLabel: string;
    destructive: boolean;
  }>({
    open: false,
    resolve: null,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    destructive: false,
  });

  function confirm({
    title,
    message,
    confirmLabel = "Confirm",
    destructive = false,
  }: {
    title: string;
    message: string;
    confirmLabel?: string;
    destructive?: boolean;
  }): Promise<boolean> {
    return new Promise((resolve) => {
      setState({ open: true, resolve, title, message, confirmLabel, destructive });
    });
  }

  function handleConfirm() {
    state.resolve?.(true);
    setState((s) => ({ ...s, open: false, resolve: null }));
  }

  function handleCancel() {
    state.resolve?.(false);
    setState((s) => ({ ...s, open: false, resolve: null }));
  }

  const modal = (
    <ConfirmModal
      open={state.open}
      title={state.title}
      message={state.message}
      confirmLabel={state.confirmLabel}
      destructive={state.destructive}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirm, modal };
}
