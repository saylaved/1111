"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { SHOP } from "@/lib/data";
import { formatRating } from "@/lib/format";
import { CountUp } from "./CountUp";
import { EASE_OUT } from "@/lib/motion";

const STORY =
  "Троє з п’яти майстрів носять прізвище Хавень. Тут стрижуть батька разом із сином за один візит, а з 953 відгуків лише 5 мають менше п’яти зірок.";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

export function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = STORY.split(" ");
  const fives = SHOP.reviews - SHOP.belowFive;

  const specs = [
    { term: "Рейтинг", value: <CountUp to={SHOP.rating} format={formatRating} />, note: `${SHOP.reviews} відгуків в Altegio` },
    { term: "П’ять зірок", value: <CountUp to={fives} />, note: `з ${SHOP.reviews} оцінок` },
    { term: "Графік", value: "10–20", note: "щодня, без вихідних" },
    { term: "Передоплата", value: <CountUp to={0} suffix={"\u00a0₴"} />, note: "перенос і скасування самостійно" },
  ];

  return (
    <section id="story" aria-labelledby="story-title" className="bg-void py-32 sm:py-44">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 id="story-title" className="text-base text-steel">
          Сімейний барбершоп
        </h2>
        <div ref={ref}>
          <p
            className="mt-6 max-w-[22ch] font-display text-[clamp(1.75rem,4.6vw,4rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-chrome"
            aria-label={STORY}
          >
            <span aria-hidden="true">
              {words.map((w, i) => (
                <Word key={`${w}-${i}`} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
              ))}
            </span>
          </p>
        </div>

        <dl className="mt-24 grid grid-cols-2 border-t border-rule lg:grid-cols-4">
          {specs.map((s, i) => (
            <motion.div
              key={s.term}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.08 }}
              className="border-b border-rule py-8 pr-6 lg:border-b-0"
            >
              <dt className="text-sm text-steel">{s.term}</dt>
              <dd className="tnum mt-3 font-display text-4xl font-semibold tracking-[-0.02em] text-chrome sm:text-5xl">{s.value}</dd>
              <dd className="mt-2 text-sm text-steel">{s.note}</dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
