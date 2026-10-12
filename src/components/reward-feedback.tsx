"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { badges } from "@/data/content";
import { Mascot } from "./art";
import { Confetti } from "./learning";
export function RewardFeedback() {
  const [toast, setToast] = useState<number | null>(null);
  const [badge, setBadge] = useState<number | undefined>();
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const receive = (event: Event) => {
      const detail = (event as CustomEvent<{ xp: number; badge?: number }>)
        .detail;
      setToast(detail.xp);
      setBadge(detail.badge);
      clearTimeout(timeout);
      timeout = setTimeout(() => setToast(null), 2600);
    };
    window.addEventListener("duel-reward", receive);
    return () => {
      window.removeEventListener("duel-reward", receive);
      clearTimeout(timeout);
    };
  }, []);
  return (
    <>
      <AnimatePresence initial={false}>
        {toast !== null && (
          <motion.div
            className="reward-toast"
            role="status"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.18 }}
          >
            ★ +{toast} XP <span>+3 bintang untuk usahamu!</span>
          </motion.div>
        )}
      </AnimatePresence>
      <Dialog.Root
        open={badge !== undefined}
        onOpenChange={(open) => {
          if (!open) setBadge(undefined);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content achievement-dialog">
            <Confetti />
            <Mascot emotion="trophy" />
            <Dialog.Title>Lencana baru untukmu!</Dialog.Title>
            <Dialog.Description>
              {badge !== undefined ? badges[badge] : ""} — satu lagi cerita
              hebat di petualanganmu.
            </Dialog.Description>
            <Dialog.Close className="button">Yuk, lanjutkan!</Dialog.Close>
            <Dialog.Close
              className="dialog-close"
              aria-label="Tutup pencapaian"
            >
              <X size={20} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
