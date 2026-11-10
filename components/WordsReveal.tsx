"use client";

import { motion } from "framer-motion";
import { Fragment, type ElementType } from "react";
import { EASE_OUT } from "@/lib/motion";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  onMount?: boolean;
};

export function WordsReveal({ text, as: Tag = "h2", className = "", delay = 0, stagger = 0.06, onMount = false }: Props) {
  const words = text.split(" ");
  const trigger = onMount
    ? { initial: "hidden", animate: "shown" }
    : { initial: "hidden", whileInView: "shown", viewport: { once: true, amount: 0.6 } };

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden="true"
        className="inline"
        variants={{ hidden: {}, shown: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
        {...trigger}
      >
        {words.map((w, i) => (
          <Fragment key={`${w}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: "105%", rotate: 4, opacity: 0 },
                shown: { y: "0%", rotate: 0, opacity: 1, transition: { duration: 0.9, ease: EASE_OUT } },
              }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
