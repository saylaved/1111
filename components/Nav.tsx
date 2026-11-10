"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useState } from "react";
import { BOOKING_URL } from "@/lib/data";
import { OpenStatus } from "./OpenStatus";
import { EASE_OUT } from "@/lib/motion";

const LINKS = [
  { href: "#masters", label: "Майстри" },
  { href: "#prices", label: "Ціни" },
  { href: "#scanner", label: "AI-підбір" },
  { href: "#reviews", label: "Відгуки" },
  { href: "#visit", label: "Контакти" },
];

export function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 24);
    setHidden(y > 480 && y > prev);
  });

  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-chrome px-4 py-2 text-sm text-void focus-visible:translate-y-0"
      >
        До змісту
      </a>
      <motion.header
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        onFocusCapture={() => setHidden(false)}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`border-b transition-[background-color,border-color] duration-500 ${
            solid ? "border-rule/80 bg-void/70 backdrop-blur-xl backdrop-saturate-150" : "border-transparent bg-transparent"
          }`}
        >
          <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 sm:px-8" aria-label="Головна навігація">
            <a href="#top" className="font-display text-sm font-semibold tracking-[0.02em] text-chrome" translate="no">
              Lypskiy
            </a>
            <OpenStatus className="hidden md:inline-flex" />
            <ul className="ml-auto hidden items-center gap-7 lg:flex">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-steel transition-colors duration-300 hover:text-chrome">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex h-9 items-center rounded-full bg-chrome px-4 text-sm font-medium text-void transition-colors duration-300 hover:bg-white lg:ml-0"
            >
              Записатися
            </a>
          </nav>
          <motion.div aria-hidden="true" style={{ scaleX: progress }} className="h-px origin-left bg-chrome/60" />
        </div>
      </motion.header>
    </>
  );
}
