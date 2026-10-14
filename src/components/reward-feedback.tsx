"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { badges } from "@/data/content";
import { Mascot } from "./art";
import { ConfettiCelebration, SparkleEffect } from "./game-motion";
import { softSpring } from "@/lib/motion";
type Reward = { xp: number; stars: number; badges: number[]; level?: number };
export function RewardFeedback() {
  const [toast, setToast] = useState<(Reward & { id: number }) | null>(null);
  const [queue, setQueue] = useState<number[]>([]);
  const serial = useRef(0);
  const reduce = useReducedMotion();
  const badge = queue[0];
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const receive = (event: Event) => {
      const detail = (event as CustomEvent<Reward>).detail;
      if (detail.xp) {
        setToast({ ...detail, id: ++serial.current });
        clearTimeout(timeout);
        timeout = setTimeout(() => setToast(null), 2800);
      }
      if (detail.badges.length)
        setQueue((current) => [...new Set([...current, ...detail.badges])]);
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
        {toast && (
          <motion.div
            key={toast.id}
            className="reward-toast"
            role="status"
            initial={{
              opacity: 0,
              y: reduce ? 0 : 15,
              scale: reduce ? 1 : 0.95,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : -16 }}
            transition={softSpring}
          >
            <SparkleEffect />★ +{toast.xp} XP{" "}
            <span>+{toast.stars} bintang untuk usahamu!</span>
            {toast.level && (
              <strong className="level-up">
                Naik ke level {toast.level}! ✦
              </strong>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <Dialog.Root
        open={badge !== undefined}
        onOpenChange={(open) => {
          if (!open) setQueue((current) => current.slice(1));
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content achievement-dialog">
            <div key={badge} className="achievement-reveal">
              <ConfettiCelebration />
              <Mascot emotion="victory" />
              <div className="unlocked-badge" aria-hidden="true">
                ★<SparkleEffect />
              </div>
              <Dialog.Title>Pencapaian baru!</Dialog.Title>
              <Dialog.Description>
                {badge !== undefined ? badges[badge] : ""} — satu lagi cerita
                hebat di petualanganmu.
              </Dialog.Description>
            </div>
            <Dialog.Close className="button">Lanjutkan</Dialog.Close>
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
