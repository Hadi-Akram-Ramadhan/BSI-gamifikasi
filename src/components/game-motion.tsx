"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useReducedMotion,
} from "motion/react";
import { Check } from "lucide-react";
import {
  calmSpring,
  fadeIn,
  hoverLift,
  pressDown,
  slideUp,
  softSpring,
  timing,
} from "@/lib/motion";

export const MotionLink = motion.create(Link);

export function AnimatedCard({
  children,
  href,
  className,
  index = 0,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  index?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <MotionLink
      href={href}
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { ...softSpring, delay: index * 0.06 },
        },
      }}
      whileHover={
        reduce
          ? undefined
          : { ...hoverLift, transition: { ...softSpring, delay: 0 } }
      }
      whileTap={reduce ? undefined : pressDown}
    >
      {children}
    </MotionLink>
  );
}

// Entry-only route transitions are safe with the App Router's streaming tree.
// The shell and external store stay mounted; no stale outgoing router tree is retained.
export function AnimatedPage({
  children,
  route,
}: {
  children: React.ReactNode;
  route: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      key={route}
      className="animated-page"
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: timing.page, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function QuestionTransition({
  children,
  id,
  className,
}: {
  children: React.ReactNode;
  id: string | number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={id}
        className={className}
        variants={reduce ? fadeIn : slideUp}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function AnimatedCounter({
  value,
  currency = false,
  className,
}: {
  value: number;
  currency?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const node = useRef<HTMLSpanElement>(null);
  const last = useRef(value);
  const format = useCallback(
    (n: number) =>
      `${currency ? "Rp" : ""}${Math.round(n).toLocaleString("id-ID")}`,
    [currency],
  );
  useEffect(() => {
    const from = last.current;
    if (reduce || from === value) {
      last.current = value;
      if (node.current) node.current.textContent = format(value);
      return;
    }
    const control = animate(from, value, {
      duration: 0.55,
      ease: "easeOut",
      onUpdate: (n) => {
        last.current = n;
        if (node.current) node.current.textContent = format(n);
      },
    });
    return () => control.stop();
    // Only the actual amount, formatting, or accessibility preference starts a count.
  }, [value, format, reduce]);
  return (
    <span
      className={`animated-counter ${className || ""}`}
      role="group"
      aria-label={format(value)}
      data-value={value}
    >
      <span aria-hidden="true" ref={node}>
        {format(value)}
      </span>
    </span>
  );
}

export function ScoreIncrease({ value }: { value: number }) {
  const [previous, setPrevious] = useState(value);
  const [delta, setDelta] = useState(0);
  const reduce = useReducedMotion();
  if (previous !== value) {
    setDelta(value - previous);
    setPrevious(value);
  }
  return (
    <span className="score-value">
      <AnimatedCounter value={value} />
      {delta > 0 && (
        <motion.span
          key={value}
          className="score-burst"
          aria-hidden="true"
          initial={{ opacity: 1, y: 8 }}
          animate={{ opacity: [1, 1, 0], y: reduce ? 0 : -28 }}
          transition={{ duration: timing.reward }}
        >
          +{delta}
        </motion.span>
      )}
    </span>
  );
}

export function AnimatedCheck() {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="animated-check"
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.25, filter: "blur(4px)" }
      }
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={calmSpring}
    >
      <Check size={20} />
    </motion.span>
  );
}

export function SparkleEffect() {
  return (
    <span className="sparkle-effect" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <i
          key={i}
          style={
            {
              "--particle-angle": `${i * 60}deg`,
              "--particle-delay": `${i * 25}ms`,
            } as React.CSSProperties
          }
        >
          ✦
        </i>
      ))}
    </span>
  );
}

export function ConfettiCelebration({ enabled = true }: { enabled?: boolean }) {
  const reduce = useReducedMotion();
  if (!enabled || reduce) return null;
  return (
    <div className="confetti celebration-confetti" aria-hidden="true">
      {Array.from({ length: 24 }, (_, i) => (
        <span
          key={i}
          style={
            {
              left: `${3 + i * 4}%`,
              animationDelay: `${(i % 5) * 0.06}s`,
              "--confetti-turn": `${120 + i * 31}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function GameCountdown({ seconds }: { seconds: number }) {
  const reduce = useReducedMotion();
  const count = Math.max(1, Math.min(3, seconds));
  return (
    <div className="countdown" role="status" aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={count}
          initial={{ opacity: 0, scale: reduce ? 1 : 0.78 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: reduce ? 1 : 1.08 }}
          transition={{ duration: 0.22 }}
        >
          {count}
        </motion.span>
      </AnimatePresence>
      <h2>Siapkan ide terbaikmu!</h2>
    </div>
  );
}

export function MatchStart({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  if (!active) return null;
  return (
    <motion.div
      className="match-start"
      aria-hidden="true"
      initial={{ opacity: 1, scale: reduce ? 1 : 0.94 }}
      animate={{ opacity: [1, 1, 0], scale: 1 }}
      transition={{ duration: 0.7, times: [0, 0.55, 1] }}
    >
      MULAI!
    </motion.div>
  );
}

export function AnimatedSavingsJar({
  value,
  target,
}: {
  value: number;
  target: number;
}) {
  const reduce = useReducedMotion();
  const [previous, setPrevious] = useState(value);
  const [deposit, setDeposit] = useState(0);
  if (previous !== value) {
    setDeposit(Math.max(0, value - previous));
    setPrevious(value);
  }
  const fill = Math.max(0, Math.min(1, value / target));
  return (
    <div
      className="animated-jar"
      role="img"
      aria-label={`Toples terisi ${Math.round(fill * 100)} persen`}
    >
      <svg viewBox="0 0 220 190" aria-hidden="true">
        <ellipse
          cx="110"
          cy="177"
          rx="69"
          ry="9"
          fill="#173568"
          opacity=".09"
        />
        <rect
          x="48"
          y="36"
          width="124"
          height="130"
          rx="28"
          fill="#bceeff"
          stroke="#3da5cb"
          strokeWidth="4"
        />
        <svg
          x="54"
          y="43"
          width="112"
          height="117"
          viewBox="0 0 112 117"
          overflow="hidden"
        >
          <motion.rect
            x="0"
            y="0"
            width="112"
            height="117"
            rx="20"
            fill="#ffcf46"
            initial={false}
            animate={{ scaleY: fill }}
            style={{ originY: 1 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }
            }
          />
        </svg>
        <rect x="52" y="23" width="116" height="24" rx="10" fill="#348ccb" />
        <path
          d="M87 34h46"
          stroke="#175a96"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="110" cy="107" r="25" fill="#ffed9b" />
        <text x="110" y="116" textAnchor="middle" fontSize="28" fill="#93611c">
          ★
        </text>
        <path
          d="M64 62v30"
          stroke="white"
          strokeWidth="7"
          strokeLinecap="round"
          opacity=".65"
        />
      </svg>
      <AnimatePresence initial={false}>
        {deposit > 0 && (
          <motion.span
            key={value}
            className="deposit-coin"
            aria-hidden="true"
            initial={{ opacity: 1, y: -25, rotate: -15 }}
            animate={{
              opacity: [1, 1, 0],
              y: reduce ? 0 : 48,
              rotate: reduce ? 0 : 15,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            Rp
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SavingBox({
  filled,
  index,
}: {
  filled: boolean;
  index: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={`saving-box ${filled ? "filled" : ""}`}
      initial={false}
      animate={{ scale: !reduce && filled ? [1, 1.12, 1] : 1 }}
      transition={{ duration: 0.28 }}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={filled ? "filled" : "empty"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {filled ? <Check size={14} /> : index + 1}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
