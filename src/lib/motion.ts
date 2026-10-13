import type { Variants } from "motion/react";

export const timing = {
  instant: 0.12,
  interaction: 0.18,
  enter: 0.32,
  page: 0.36,
  reward: 0.9,
};
export const softSpring = {
  type: "spring",
  duration: 0.38,
  bounce: 0.12,
} as const;
export const calmSpring = { type: "spring", duration: 0.3, bounce: 0 } as const;
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: timing.enter } },
  exit: { opacity: 0, transition: { duration: timing.instant } },
};
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: softSpring },
  exit: { opacity: 0, y: -6, transition: { duration: timing.instant } },
};
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: softSpring },
  exit: { opacity: 0, scale: 0.98, transition: { duration: timing.instant } },
};
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
export const pressDown = { scale: 0.96 };
export const hoverLift = { y: -4, scale: 1.015 };
export const lessonSlide: Variants = {
  hidden: (direction: number) => ({ opacity: 0, x: direction * 14 }),
  visible: { opacity: 1, x: 0, transition: { duration: 0.24 } },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -8,
    transition: { duration: 0.12 },
  }),
};
