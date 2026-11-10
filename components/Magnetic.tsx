"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { ReactNode, PointerEvent } from "react";
import { SPRING_SNAPPY } from "@/lib/motion";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  strength?: number;
};

export function Magnetic({ href, children, className = "", external = false, strength = 0.28 }: Props) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), SPRING_SNAPPY);
  const y = useSpring(useMotionValue(0), SPRING_SNAPPY);

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}
