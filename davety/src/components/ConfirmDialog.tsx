"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

type Variant = "default" | "danger";

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
}

interface PendingPromise {
  resolve: (value: boolean) => void;
}

interface ConfirmCtx {
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
}

const Ctx = createContext<ConfirmCtx | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ConfirmOptions>({ title: "" });
  const pending = useRef<PendingPromise | null>(null);

  const confirm = useCallback((next: ConfirmOptions) => {
    setOpts(next);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      pending.current = { resolve };
    });
  }, []);

  function settle(value: boolean) {
    pending.current?.resolve(value);
    pending.current = null;
    setOpen(false);
  }

  const variant = opts.variant ?? "default";
  const isDanger = variant === "danger";

  return (
    <Ctx.Provider value={{ confirm }}>
      {children}

      <Dialog.Root
        open={open}
        onOpenChange={(o) => {
          if (!o) settle(false);
        }}
      >
        <Dialog.Portal>
          <AnimatePresence>
            {open ? (
              <>
                <Dialog.Overlay asChild>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                  />
                </Dialog.Overlay>
                <Dialog.Content asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card border border-border p-6 shadow-2xl"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`shrink-0 inline-flex items-center justify-center size-9 rounded-full ${
                          isDanger
                            ? "bg-destructive/15 text-destructive"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        <AlertTriangle className="size-4" />
                      </span>
                      <div className="flex-1">
                        <Dialog.Title className="font-display text-lg leading-tight">
                          {opts.title}
                        </Dialog.Title>
                        {opts.description ? (
                          <Dialog.Description className="mt-1.5 text-sm text-muted-foreground leading-snug">
                            {opts.description}
                          </Dialog.Description>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-2">
                      <button
                        onClick={() => settle(false)}
                        className="px-4 py-2 rounded-full border border-border text-sm cursor-pointer hover:bg-muted"
                      >
                        {opts.cancelLabel ?? "Vazgeç"}
                      </button>
                      <button
                        onClick={() => settle(true)}
                        className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
                          isDanger
                            ? "bg-destructive text-destructive-foreground hover:opacity-90"
                            : "bg-primary text-primary-foreground hover:opacity-90"
                        }`}
                      >
                        {opts.confirmLabel ?? "Onayla"}
                      </button>
                    </div>
                  </motion.div>
                </Dialog.Content>
              </>
            ) : null}
          </AnimatePresence>
        </Dialog.Portal>
      </Dialog.Root>
    </Ctx.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useConfirm must be used inside <ConfirmProvider>");
  }
  return ctx.confirm;
}
