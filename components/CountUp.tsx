"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  from?: number;
  duration?: number;
  format?: (n: number) => string;
  suffix?: string;
};

const defaultFormat = (n: number) => new Intl.NumberFormat("uk-UA").format(Math.round(n));

export function CountUp({ to, from, duration = 1.6, format = defaultFormat, suffix = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const reduce = useReducedMotion();
  const start = from ?? (to === 0 ? 0 : to * 0.6);
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!inView || reduce || to === start) return;
    const controls = animate(start, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: setValue });
    return () => controls.stop();
  }, [inView, reduce, to, start, duration]);

  return (
    <span ref={ref}>
      {format(value)}
      {suffix}
    </span>
  );
}
