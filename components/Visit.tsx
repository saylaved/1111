"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BOOKING_URL, SHOP } from "@/lib/data";
import { Magnetic } from "./Magnetic";
import { OpenStatus } from "./OpenStatus";

export function Visit() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], ["4rem", "0rem"]);

  return (
    <section id="visit" ref={ref} aria-label="Як нас знайти" className="bg-void pt-10">
      <motion.div style={{ scale, borderTopLeftRadius: radius, borderTopRightRadius: radius }} className="origin-bottom overflow-hidden bg-chrome text-void">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <p className="text-base text-slate">Київ, Печерськ</p>
          <h2 className="mt-4 font-display text-[clamp(2.25rem,8vw,7rem)] leading-[0.98] font-semibold tracking-[-0.03em]">
            Мечникова, 5
          </h2>

          <dl className="mt-14 grid gap-8 border-t border-void/15 pt-8 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-slate">Графік</dt>
              <dd className="tnum mt-2 text-xl font-medium">Щодня 10:00–20:00</dd>
            </div>
            <div>
              <dt className="text-sm text-slate">Передоплата</dt>
              <dd className="mt-2 text-xl font-medium">Не потрібна</dd>
            </div>
            <div>
              <dt className="text-sm text-slate">Візит</dt>
              <dd className="mt-2 text-xl font-medium">Перенос і скасування онлайн</dd>
            </div>
          </dl>

          <div className="mt-16 flex flex-wrap items-center gap-3">
            <Magnetic
              href={BOOKING_URL}
              external
              className="inline-flex h-14 items-center rounded-full bg-void px-8 text-base font-medium text-chrome transition-colors duration-300 hover:bg-ink"
            >
              Записатися онлайн
            </Magnetic>
            <a
              href={SHOP.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center rounded-full px-7 text-base ring-1 ring-void/25 transition-[background-color,box-shadow] duration-300 ring-inset hover:bg-void/5 hover:ring-void/50"
            >
              Прокласти маршрут
            </a>
          </div>
        </div>

        <footer className="border-t border-void/15">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 pb-[calc(6rem+env(safe-area-inset-bottom))] text-sm text-slate sm:px-8 lg:pb-8">
            <p>
              © 2026 <span translate="no">Lypskiy barbershop</span> · {SHOP.city}, {SHOP.street}
            </p>
            <OpenStatus className="!text-slate" />
          </div>
        </footer>
      </motion.div>
    </section>
  );
}
