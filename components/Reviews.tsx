"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { REVIEWS, SHOP } from "@/lib/data";
import { formatRating } from "@/lib/format";
import { ReviewGrid } from "./ReviewGrid";
import { WordsReveal } from "./WordsReveal";
import { EASE_OUT } from "@/lib/motion";

const INTERVAL_MS = 7000;
const ROUND_BUTTON =
  "grid size-11 place-items-center rounded-full text-chrome ring-1 ring-rule transition-colors duration-300 ring-inset hover:bg-graphite";

export function Reviews() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % REVIEWS.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [playing]);

  const go = (delta: number) => setIndex((i) => (i + delta + REVIEWS.length) % REVIEWS.length);
  const r = REVIEWS[index];

  return (
    <section id="reviews" aria-label="Відгуки" className="bg-void py-28 sm:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <WordsReveal
              text={`${SHOP.reviews} відгуки. ${SHOP.belowFive} нижче п’яти зірок.`}
              className="max-w-[14ch] font-display text-[clamp(2rem,5vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.025em] text-chrome"
            />
            <p className="mt-5 max-w-md text-steel">
              Кожна клітинка — одна оцінка з Altegio. Червоні клітинки показують п’ять оцінок нижче п’яти; їхнє місце — не хронологія. Середній бал{" "}
              <span className="tnum text-chrome">{formatRating(SHOP.rating)}</span>.
            </p>
          </div>
          <ReviewGrid total={SHOP.reviews} low={SHOP.belowFive} />
        </div>

        <figure className="mt-24 border-t border-rule pt-12" aria-roledescription="карусель" aria-label="Відгуки клієнтів">
          <div className="min-h-[11rem] sm:min-h-[9rem]" aria-live={playing ? "off" : "polite"}>
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.55, ease: EASE_OUT }}
                className="max-w-4xl"
              >
                <p className="font-display text-[clamp(1.375rem,3vw,2.5rem)] leading-[1.2] font-semibold tracking-[-0.015em] text-chrome">
                  “{r.text}”
                </p>
                <footer className="mt-5 text-steel">
                  {r.author}, клієнт майстра {r.master}
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Попередній відгук"
              className={ROUND_BUTTON}
            >
              <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Наступний відгук"
              className={ROUND_BUTTON}
            >
              <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Зупинити автопрокрутку" : "Увімкнути автопрокрутку"}
              aria-pressed={!playing}
              className={ROUND_BUTTON}
            >
              {playing ? (
                <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true"><path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="1.8" /></svg>
              ) : (
                <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true"><path d="M5 3l8 5-8 5z" fill="currentColor" /></svg>
              )}
            </button>
            <p className="tnum ml-3 text-sm text-steel" aria-hidden="true">
              {index + 1} / {REVIEWS.length}
            </p>
            <div className="ml-auto hidden h-px w-40 overflow-hidden bg-rule sm:block" aria-hidden="true">
              {playing && (
                <motion.div
                  key={index}
                  className="h-full origin-left bg-chrome"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: INTERVAL_MS / 1000, ease: "linear" }}
                />
              )}
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
