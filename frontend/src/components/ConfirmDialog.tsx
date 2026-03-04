import React from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      {/* Blurred Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      ></div>

      {/* Modal Box - Upgraded with Gold Theme Elements */}
      <div className="bg-card border border-border border-t-2 border-t-accent/60 rounded-2xl shadow-[0_10px_40px_rgba(197,160,89,0.08)] w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Signature Ambient Gold Glows */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

        <div className="p-7 relative z-10">
          <div className="flex items-start gap-4 mb-3">
            {/* Icon Container */}
            <div
              className={`h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 shadow-inner ${
                isDestructive
                  ? "bg-red-500/10 text-red-500 border-red-500/20"
                  : "bg-accent/10 text-accent border-accent/30"
              }`}
            >
              <span className="material-symbols-outlined text-2xl drop-shadow-sm">
                {isDestructive ? "warning" : "help"}
              </span>
            </div>

            <div className="pt-1">
              <h3 className="text-xl font-bold text-foreground font-serif tracking-wide">
                {title}
              </h3>
            </div>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed mb-8 pl-16">
            {message}
          </p>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-border/50 relative">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all border border-transparent hover:border-accent/30 tracking-wide"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all hover:-translate-y-0.5 tracking-wider uppercase ${
                isDestructive
                  ? "bg-red-600/90 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)] border border-red-500/50"
                  : "bg-accent hover:bg-accent/90 text-[#0B1120] shadow-[0_0_20px_rgba(197,160,89,0.3)] border border-accent"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
