"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BOOKING_URL, SHOP } from "@/lib/data";
import { formatRating } from "@/lib/format";
import { EASE_OUT } from "@/lib/motion";
import { FadeField } from "./FadeField";
import { Magnetic } from "./Magnetic";
import { WordsReveal } from "./WordsReveal";

const GUARDS = [
  { n: "#0", mm: "0 мм" },
  { n: "#1", mm: "3 мм" },
  { n: "#2", mm: "6 мм" },
  { n: "#3", mm: "10 мм" },
  { n: "#4", mm: "13 мм" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const fieldY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section ref={ref} id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-void pt-28">
      <motion.div
        style={{ scale: titleScale, opacity: titleOpacity }}
        className="relative z-10 mx-auto w-full max-w-7xl origin-top px-5 sm:px-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
          className="text-base text-steel"
        >
          Сімейний барбершоп на Мечникова, 5
        </motion.p>

        <WordsReveal
          as="h1"
          onMount
          delay={0.2}
          stagger={0.08}
          text="Стрижка, за якою повертаються."
          className="mt-5 max-w-[14ch] font-display text-[clamp(1.75rem,7.6vw,7rem)] leading-[0.98] font-semibold tracking-[-0.03em] text-chrome"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.85 }}
          className="mt-8 flex max-w-xl flex-col gap-8"
        >
          <p className="text-lg leading-relaxed text-steel">
            П’ять майстрів, щодня з 10:00 до 20:00. Рейтинг{" "}
            <span className="tnum text-chrome">{formatRating(SHOP.rating)}</span> з{" "}
            <span className="tnum text-chrome">{SHOP.reviews}</span> відгуків. Запис без передоплати.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Magnetic
              href={BOOKING_URL}
              external
              className="inline-flex h-13 items-center rounded-full bg-chrome px-7 text-base font-medium text-void transition-colors duration-300 hover:bg-white"
            >
              Обрати час
            </Magnetic>
            <a
              href="#scanner"
              className="inline-flex h-13 items-center rounded-full px-6 text-base text-chrome ring-1 ring-rule transition-[box-shadow,background-color] duration-300 ring-inset hover:bg-graphite hover:ring-steel"
            >
              Підібрати стрижку
            </a>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: fieldY }}
        initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
        animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
        transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.4 }}
        className="relative mt-auto h-[34svh] min-h-56 w-full"
      >
        <FadeField />
      </motion.div>

      <div className="relative z-10 border-t border-rule bg-void">
        <ol className="mx-auto grid max-w-7xl grid-cols-5 px-5 py-3 text-xs text-steel sm:px-8" aria-label="Шкала насадок машинки, від найкоротшої до найдовшої">
          {GUARDS.map((g, i) => (
            <li key={g.n} className={`tnum ${i === 0 ? "text-left" : i === GUARDS.length - 1 ? "text-right" : "text-center"}`}>
              <span className="text-chrome">{g.n}</span> <span className="hidden sm:inline">{g.mm}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
