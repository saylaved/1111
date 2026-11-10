"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

const CELL = 10;
const GAP = 3;

// Group the lower scores last; their position is illustrative, not chronological.
function lowIndexes(total: number, low: number) {
  return new Set(Array.from({ length: low }, (_, i) => total - low + i));
}

export function ReviewGrid({ total, low }: { total: number; low: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !wrap || !ctx) return;
    const lows = lowIndexes(total, low);
    let progress = 0;
    let cols = 1;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = wrap.clientWidth;
      cols = Math.max(1, Math.floor((width + GAP) / (CELL + GAP)));
      const rows = Math.ceil(total / cols);
      const height = rows * (CELL + GAP) - GAP;
      canvas.style.height = `${height}px`;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const lit = Math.round(progress * total);
      for (let i = 0; i < total; i++) {
        const x = (i % cols) * (CELL + GAP);
        const y = Math.floor(i / cols) * (CELL + GAP);
        if (i >= lit) ctx.fillStyle = "rgba(43, 46, 51, 0.6)";
        else if (lows.has(i)) ctx.fillStyle = "#d0312d";
        else ctx.fillStyle = "rgba(230, 232, 235, 0.88)";
        ctx.beginPath();
        ctx.roundRect(x, y, CELL, CELL, 2.5);
        ctx.fill();
      }
    };

    const ro = new ResizeObserver(draw);
    ro.observe(wrap);

    if (!inView) {
      draw();
      return () => ro.disconnect();
    }
    if (reduce) {
      progress = 1;
      draw();
      return () => ro.disconnect();
    }
    const controls = animate(0, 1, {
      duration: 2.4,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        progress = v;
        draw();
      },
    });
    return () => {
      controls.stop();
      ro.disconnect();
    };
  }, [inView, reduce, total, low]);

  return (
    <div ref={wrapRef} className="w-full">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`${total} відгуків: ${total - low} з оцінкою п’ять зірок, ${low} нижче`}
        className="block w-full"
      />
    </div>
  );
}
