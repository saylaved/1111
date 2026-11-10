"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { BOOKING_URL, SHAPES, type ShapeKey } from "@/lib/data";
import { formatUAH } from "@/lib/format";
import { WordsReveal } from "./WordsReveal";
import { EASE_OUT } from "@/lib/motion";

type Phase = "idle" | "scanning" | "done" | "error";

const STEPS = ["Пошук обличчя…", "Аналіз пропорцій…", "Підбір форм…"];
const STEP_MS = 900;
const MAX_FILE_BYTES = 15 * 1024 * 1024;
const SHAPE_KEYS = Object.keys(SHAPES) as ShapeKey[];

// Prototype heuristic on frame proportions only. The user always confirms the shape.
// Production: replace with an on-device landmark model (MediaPipe FaceLandmarker, WASM).
function estimateShape(w: number, h: number): ShapeKey {
  const r = h / w;
  if (r > 1.45) return "oblong";
  if (r > 1.25) return "oval";
  if (r < 1.05) return "round";
  return "square";
}

const CORNERS = [
  "top-4 left-4 border-t-2 border-l-2 rounded-tl-xl",
  "top-4 right-4 border-t-2 border-r-2 rounded-tr-xl",
  "bottom-4 left-4 border-b-2 border-l-2 rounded-bl-xl",
  "bottom-4 right-4 border-b-2 border-r-2 rounded-br-xl",
];

export function Scanner() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const [shape, setShape] = useState<ShapeKey | null>(null);
  const timers = useRef<number[]>([]);
  const shapeRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  useEffect(
    () => () => {
      if (photo) URL.revokeObjectURL(photo);
    },
    [photo],
  );

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > MAX_FILE_BYTES) {
      setPhoto(null);
      setShape(null);
      setPhase("error");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setPhoto(url);
      const suggestion = estimateShape(img.naturalWidth, img.naturalHeight);
      setShape(null);
      setStep(0);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setPhase("done");
        setShape(suggestion);
        return;
      }
      setPhase("scanning");
      timers.current = [
        ...STEPS.map((_, i) => window.setTimeout(() => setStep(i), i * STEP_MS)),
        window.setTimeout(() => {
          setPhase("done");
          setShape(suggestion);
        }, STEPS.length * STEP_MS + 100),
      ];
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setPhoto(null);
      setShape(null);
      setPhase("error");
    };
    img.src = url;
  };

  const onShapeKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!shape) return;
    const i = SHAPE_KEYS.indexOf(shape);
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % SHAPE_KEYS.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + SHAPE_KEYS.length) % SHAPE_KEYS.length;
    else return;
    e.preventDefault();
    setShape(SHAPE_KEYS[next]);
    shapeRefs.current[next]?.focus();
  };

  const statusText =
    phase === "idle"
      ? "Очікує фото"
      : phase === "scanning"
        ? STEPS[step]
        : phase === "error"
          ? "Файл не відкрився. Оберіть JPG, PNG або WebP до 15 МБ."
          : "Готово. Фото не залишало ваш пристрій.";

  const reco = shape ? SHAPES[shape] : null;

  return (
    <section id="scanner" aria-label="AI-підбір стрижки" className="bg-void py-28 sm:py-40">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_minmax(0,28rem)] lg:gap-20">
        <div className="flex flex-col">
          <p className="text-base text-steel">AI-підбір, бета</p>
          <WordsReveal
            text="Яка стрижка пасує саме вам?"
            className="mt-5 max-w-[14ch] font-display text-[clamp(2rem,5vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.025em] text-chrome"
          />
          <p className="mt-6 max-w-md text-lg leading-relaxed text-steel">
            Завантажте фото анфас. Обробка відбувається тільки у вашому браузері: фото нікуди не надсилається.
          </p>

          <label className="mt-8 inline-flex h-13 w-fit cursor-pointer items-center rounded-full bg-chrome px-7 text-base font-medium text-void transition-colors duration-300 focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-chrome hover:bg-white">
            {phase === "idle" || phase === "error" ? "Завантажити фото" : "Інше фото"}
            <input type="file" accept="image/jpeg,image/png,image/webp" capture="user" onChange={onFile} className="sr-only" />
          </label>
          <p className="mt-3 text-sm text-steel">JPG, PNG або WebP до 15 МБ. Рівне світло, волосся прибране з чола.</p>
          <p className="mt-6 max-w-md border-l border-rule pl-4 text-sm text-steel">
            Бета-версія оцінює форму за пропорціями кадру, тому остаточний вибір за вами. Наступна версія розпізнаватиме
            контури обличчя прямо на пристрої.
          </p>

          <AnimatePresence mode="wait">
            {phase === "done" && reco && shape && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className="mt-12"
              >
                <p id="shape-label" className="text-sm text-steel">
                  Схоже на «{reco.label}». Уточніть форму обличчя:
                </p>
                <div
                  role="radiogroup"
                  aria-labelledby="shape-label"
                  onKeyDown={onShapeKey}
                  className="mt-4 flex flex-wrap gap-2"
                >
                  {SHAPE_KEYS.map((k, i) => {
                    const checked = k === shape;
                    return (
                      <button
                        key={k}
                        ref={(el) => {
                          shapeRefs.current[i] = el;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        tabIndex={checked ? 0 : -1}
                        onClick={() => setShape(k)}
                        className={`relative h-10 rounded-full px-4 text-sm ring-1 ring-rule transition-colors duration-300 ring-inset ${
                          checked ? "text-void" : "text-steel hover:text-chrome"
                        }`}
                      >
                        {checked && (
                          <motion.span
                            layoutId="shape-pill"
                            className="absolute inset-0 rounded-full bg-chrome"
                            transition={{ type: "spring", stiffness: 450, damping: 34 }}
                          />
                        )}
                        <span className="relative">{SHAPES[k].label}</span>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={shape}
                    initial="hidden"
                    animate="shown"
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.08 } } }}
                    className="mt-8 space-y-3"
                    aria-live="polite"
                  >
                    <motion.p variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }} className="text-steel">
                      {reco.tip}
                    </motion.p>
                    {reco.recos.map((r) => (
                      <motion.div
                        key={r.service}
                        variants={{ hidden: { opacity: 0, x: -16 }, shown: { opacity: 1, x: 0 } }}
                        transition={{ duration: 0.5, ease: EASE_OUT }}
                        className="rounded-2xl bg-graphite p-5"
                      >
                        <div className="flex items-baseline justify-between gap-4">
                          <h3 className="font-display text-base font-semibold text-chrome">{r.service}</h3>
                          <span className="tnum shrink-0 text-sm text-chrome">від {formatUAH(r.from)}</span>
                        </div>
                        <p className="mt-2 text-sm text-steel">{r.why}</p>
                      </motion.div>
                    ))}
                    <motion.a
                      variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex h-12 items-center rounded-full bg-chrome px-6 text-sm font-medium text-void transition-colors duration-300 hover:bg-white"
                    >
                      Записатися на цю стрижку
                    </motion.a>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-graphite">
          <p role="status" className="sr-only">
            {statusText}
          </p>
          {photo ? (
            // next/image cannot optimise blob: URLs.
            <motion.img
              key={photo}
              src={photo}
              alt="Ваше фото для підбору стрижки"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: EASE_OUT }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <svg viewBox="0 0 300 400" className="absolute inset-0 m-auto h-3/5 w-3/5 text-rule" aria-hidden="true">
              <motion.path
                d="M150 40c-62 0-100 48-100 120 0 58 22 104 52 132 18 17 33 24 48 24s30-7 48-24c30-28 52-74 52-132 0-72-38-120-100-120Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
              <motion.path
                d="M150 120v150M90 190h120"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.4, duration: 0.8 }}
              />
            </svg>
          )}

          <motion.div
            aria-hidden="true"
            animate={{ opacity: phase === "scanning" ? 0.5 : 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(230_232_235/0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgb(230_232_235/0.14)_1px,transparent_1px)] bg-[size:2rem_2rem]"
          />

          <AnimatePresence>
            {phase === "scanning" && (
              <motion.div
                key="beam"
                aria-hidden="true"
                initial={{ y: "0%", opacity: 0 }}
                animate={{ y: ["0%", "100%", "0%"], opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ y: { duration: 2.4, ease: "easeInOut", repeat: Infinity }, opacity: { duration: 0.3 } }}
                className="pointer-events-none absolute inset-0"
              >
                <span className="block h-px bg-chrome shadow-[0_0_24px_6px_rgb(230_232_235/0.35)]" />
              </motion.div>
            )}
          </AnimatePresence>

          {CORNERS.map((c, i) => (
            <motion.span
              key={c}
              aria-hidden="true"
              animate={
                phase === "scanning"
                  ? { scale: [1, 0.9, 1], opacity: 1 }
                  : { scale: 1, opacity: phase === "done" ? 1 : 0.5 }
              }
              transition={phase === "scanning" ? { duration: 1.2, repeat: Infinity, delay: i * 0.1 } : { duration: 0.4 }}
              className={`absolute size-10 border-chrome ${c}`}
            />
          ))}

          <div className="absolute inset-x-4 bottom-4 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={statusText}
                aria-hidden="true"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="rounded-full bg-void/70 px-4 py-2 text-center text-sm text-chrome backdrop-blur-md"
              >
                {statusText}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
