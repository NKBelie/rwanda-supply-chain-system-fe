"use client";
import { ReactNode, useEffect } from "react";
import { X, AlertTriangle, Trash2, CheckCircle2, XCircle, Info } from "lucide-react";
import { Button } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { cn } from "@/utils";

// ─── Base Modal ───────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = "md" }: {
  open: boolean; onClose: () => void; title?: string;
  children: ReactNode; size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full rounded-2xl border border-border bg-background shadow-pop", widths[size])}>
        {title && (
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold">{title}</h2>
            <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-surface" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ─── ConfirmModal ─────────────────────────────────────────────────────────────
export function ConfirmModal({ open, onClose, onConfirm, title, message, loading }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; message: string; loading?: boolean;
}) {
  const t = useT();
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="p-5 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-warning/10 text-warning">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="font-semibold">{title} </h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-5 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>{t("form.cancel")}</Button>
          <Button variant="primary" className="flex-1" loading={loading} onClick={onConfirm}>{t("form.confirm")}</Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── DeleteModal ──────────────────────────────────────────────────────────────
export function DeleteModal({ open, onClose, onDelete, label, loading }: {
  open: boolean; onClose: () => void; onDelete: () => void;
  label: string; loading?: boolean;
}) {
  const t = useT();
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="p-5 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-danger/10 text-danger">
          <Trash2 className="h-6 w-6" />
        </div>
        <h3 className="font-semibold">{t("form.delete")} {label}?</h3>
        <p className="mt-2 text-sm text-muted-foreground">{t("common.deleteConfirm")}</p>
        <div className="mt-5 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>{t("form.cancel")}</Button>
          <Button variant="danger" className="flex-1" loading={loading} onClick={onDelete}>{t("form.delete")}</Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── SuccessModal ─────────────────────────────────────────────────────────────
export function SuccessModal({ open, onClose, title, message }: {
  open: boolean; onClose: () => void; title: string; message?: string;
}) {
  const t = useT();
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="p-5 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="font-semibold">{title}</h3>
        {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
        <Button className="mt-5 w-full" onClick={onClose}>{t("common.close")}</Button>
      </div>
    </Modal>
  );
}

// ─── ErrorModal ───────────────────────────────────────────────────────────────
export function ErrorModal({ open, onClose, title, message }: {
  open: boolean; onClose: () => void; title: string; message?: string;
}) {
  const t = useT();
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="p-5 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-danger/10 text-danger">
          <XCircle className="h-6 w-6" />
        </div>
        <h3 className="font-semibold">{title}</h3>
        {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
        <Button variant="outline" className="mt-5 w-full" onClick={onClose}>{t("common.close")}</Button>
      </div>
    </Modal>
  );
}

// ─── InfoModal ────────────────────────────────────────────────────────────────
export function InfoModal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode;
}) {
  const t = useT();
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="p-5">{children}</div>
      <div className="border-t border-border p-4">
        <Button variant="outline" className="w-full" onClick={onClose}>{t("common.close")}</Button>
      </div>
    </Modal>
  );
}

// ─── LogoutModal ──────────────────────────────────────────────────────────────
export function LogoutModal({ open, onClose, onConfirm }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
}) {
  const t = useT();
  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={t("common.logout")}
      message={t("common.logoutConfirm")}
    />
  );
}
