"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";
import { MASTERS, masterBookingUrl, type Master } from "@/lib/data";
import { formatRating, formatUAH } from "@/lib/format";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { WordsReveal } from "./WordsReveal";
import { EASE_OUT } from "@/lib/motion";

function MasterCard({ m, index }: { m: Master; index: number }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 260, damping: 24 });
  const ry = useSpring(useMotionValue(0), { stiffness: 260, damping: 24 });
  const [hover, setHover] = useState(false);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    setHover(false);
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: index * 0.07 }}
      className="w-[78vw] max-w-[22rem] shrink-0 snap-start lg:w-[24rem] lg:max-w-none"
      style={{ perspective: 1000 }}
    >
      <motion.article
        onPointerMove={onMove}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="group relative overflow-hidden rounded-[1.75rem] bg-graphite focus-within:ring-2 focus-within:ring-chrome focus-within:ring-inset"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={m.photo}
            alt={`${m.name}, ${m.levelLabel.toLowerCase()}`}
            width={m.width}
            height={m.height}
            sizes="(min-width: 1024px) 24rem, 78vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <motion.div
            aria-hidden="true"
            animate={{ opacity: hover ? 0 : 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <Image
              src={m.photo}
              alt=""
              width={m.width}
              height={m.height}
              sizes="(min-width: 1024px) 24rem, 78vw"
              className="h-full w-full object-cover grayscale contrast-[1.08]"
            />
          </motion.div>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-graphite to-transparent" />
          {m.english && (
            <span className="absolute top-4 left-4 rounded-full bg-void/70 px-3 py-1 text-xs text-chrome backdrop-blur-md" lang="en">
              Speaks English
            </span>
          )}
        </div>
        <div className="relative -mt-16 p-6" style={{ transform: "translateZ(40px)" }}>
          <h3 className="font-display text-xl font-semibold tracking-[-0.01em] text-chrome">{m.name}</h3>
          <p className="mt-1 flex flex-wrap gap-x-3 text-sm text-steel">
            <span>{m.levelLabel}</span>
            <span className="tnum">
              <span aria-hidden="true">★</span> {formatRating(m.rating)}
              <span className="sr-only"> з 5,</span> · {m.reviews} відгуків
            </span>
          </p>
          <a
            href={masterBookingUrl(m.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex h-11 items-center justify-between rounded-full bg-void/60 px-5 text-sm text-chrome ring-1 ring-rule transition-[background-color,box-shadow] duration-300 ring-inset hover:bg-chrome hover:text-void"
          >
            <span>Записатися до {m.genitive}</span>
            <span className="tnum">від {formatUAH(m.from)}</span>
          </a>
        </div>
      </motion.article>
    </motion.li>
  );
}

export function Masters() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const distance = useRef(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => {
    const t = Math.min(1, Math.max(0, (p - 0.05) / 0.9));
    return -distance.current * t;
  });
  const smoothX = useSpring(x, { stiffness: 120, damping: 30, mass: 0.6 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !desktop) return;
    const measure = () => {
      distance.current = Math.max(0, track.scrollWidth - window.innerWidth + 64);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [desktop]);

  const revealFocused = (e: FocusEvent<HTMLUListElement>) => {
    const section = sectionRef.current;
    const item = (e.target as HTMLElement).closest("li");
    if (!desktop || !section || !item?.parentElement) return;
    const index = Array.from(item.parentElement.children).indexOf(item);
    const range = section.offsetHeight - window.innerHeight;
    const progress = 0.05 + 0.9 * (index / Math.max(MASTERS.length - 1, 1));
    window.scrollTo({ top: section.offsetTop + range * progress, behavior: "instant" });
  };

  const header = (
    <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-5 sm:px-8">
      <div>
        <WordsReveal
          text="П’ять майстрів, три рівні."
          className="font-display text-[clamp(2rem,5vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.025em] text-chrome"
        />
        <p className="mt-4 max-w-md text-steel">
          Рівень впливає на ціну й тривалість візиту. Найнижчий рейтинг серед майстрів: 4,97.
        </p>
      </div>
    </div>
  );

  const list = (
    <ul
      ref={trackRef}
      onFocus={revealFocused}
      className="flex gap-4 px-5 sm:px-8 lg:gap-6"
      aria-label="Майстри"
    >
      {MASTERS.map((m, i) => (
        <MasterCard key={m.id} m={m} index={i} />
      ))}
    </ul>
  );

  if (!desktop) {
    return (
      <section id="masters" ref={sectionRef} aria-label="Майстри" className="bg-void py-24">
        {header}
        <div className="mt-12 snap-x snap-mandatory overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none]">
          {list}
        </div>
      </section>
    );
  }

  return (
    <section id="masters" ref={sectionRef} aria-label="Майстри" className="relative bg-void" style={{ height: "260vh" }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-14 overflow-hidden">
        {header}
        <motion.div style={{ x: smoothX }} className="will-change-transform">
          {list}
        </motion.div>
      </div>
    </section>
  );
}
