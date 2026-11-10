"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { BOOKING_URL, FAMILY_TWO_SONS_FROM, LEVELS, PRICE_SNAPSHOT, PRICES, type LevelKey } from "@/lib/data";
import { formatDate, formatUAH } from "@/lib/format";
import { WordsReveal } from "./WordsReveal";
import { EASE_OUT } from "@/lib/motion";

const MAX_MINUTES = 135;

function toMinutes(duration: string) {
  const h = /(\d+)\s*год/.exec(duration);
  const m = /(\d+)\s*хв/.exec(duration);
  return (h ? Number(h[1]) * 60 : 0) + (m ? Number(m[1]) : 0);
}

function PriceTicker({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 140, damping: 22 });
  const text = useTransform(spring, (v) => formatUAH(Math.round(v / 10) * 10));
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);
  return <motion.span className="tnum">{text}</motion.span>;
}

function isLevel(v: string | null): v is LevelKey {
  return v === "top" || v === "barber" || v === "junior";
}

export function Prices() {
  const [level, setLevel] = useState<LevelKey>("top");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("level");
    if (isLevel(fromUrl)) setLevel(fromUrl);
  }, []);

  const choose = (next: LevelKey) => {
    setLevel(next);
    const url = new URL(window.location.href);
    url.searchParams.set("level", next);
    window.history.replaceState(null, "", url);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = LEVELS.findIndex((l) => l.key === level);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % LEVELS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + LEVELS.length) % LEVELS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = LEVELS.length - 1;
    else return;
    e.preventDefault();
    choose(LEVELS[next].key);
    tabRefs.current[next]?.focus();
  };

  const current = LEVELS.find((l) => l.key === level);

  return (
    <section id="prices" aria-label="Ціни" className="rounded-t-[2.5rem] bg-talc py-28 text-ink sm:py-36 [color-scheme:light]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <WordsReveal
              text="Ціна залежить від рівня майстра."
              className="max-w-[16ch] font-display text-[clamp(2rem,5vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.025em]"
            />
            <p className="mt-4 text-slate">
              {current?.label}: {current?.hint}
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Рівень майстра"
            onKeyDown={onKeyDown}
            className="relative flex rounded-full bg-mist p-1"
          >
            {LEVELS.map((l, i) => {
              const selected = l.key === level;
              return (
                <button
                  key={l.key}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${l.key}`}
                  aria-selected={selected}
                  aria-controls="price-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => choose(l.key)}
                  className={`relative h-11 rounded-full px-5 text-sm font-medium transition-colors duration-300 ${
                    selected ? "text-talc" : "text-slate hover:text-ink"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="level-pill"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div id="price-panel" role="tabpanel" aria-labelledby={`tab-${level}`} tabIndex={0}>
          <ul className="mt-16 border-t border-ink/15">
          {PRICES[level].map((s, i) => {
            const minutes = toMinutes(s.duration);
            const family = s.title === "Батько + син";
            return (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: i * 0.04 }}
                className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 border-b border-ink/15 py-6 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto]"
              >
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold tracking-[-0.01em] sm:text-xl">{s.title}</h3>
                  {family && <p className="mt-1 text-sm text-slate">Один візит на двох. Для двох синів: від {formatUAH(FAMILY_TWO_SONS_FROM)}.</p>}
                </div>
                <div className="col-span-2 flex items-center gap-4 sm:col-span-1">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
                    <motion.div
                      className="h-full origin-left rounded-full bg-ink"
                      initial={false}
                      animate={{ scaleX: minutes / MAX_MINUTES }}
                      transition={{ type: "spring", stiffness: 160, damping: 24 }}
                    />
                  </div>
                  <span className="tnum w-24 text-right text-sm text-slate">{s.duration}</span>
                </div>
                <p className="row-start-1 text-right font-display text-xl font-semibold sm:col-start-3 sm:text-2xl">
                  <PriceTicker value={s.price} />
                </p>
              </motion.li>
            );
          })}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-md text-sm text-slate">
            Ціни з онлайн-запису на {formatDate(PRICE_SNAPSHOT)}. Остаточну вартість підтверджує майстер.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-medium text-talc transition-colors duration-300 hover:bg-black"
          >
            Записатися онлайн
          </a>
        </div>
      </div>
    </section>
  );
}
