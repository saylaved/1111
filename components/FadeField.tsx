"use client";

import { useEffect, useRef } from "react";

// Strands get longer left → right like a skin fade from guard #0 to #4.
// A mouse pass trims nearby strands; they grow back on a spring.
const GAP = 7;
const TRIM_RADIUS = 90;

type Strand = { x: number; base: number; cut: number; v: number; phase: number };

function fadeCurve(t: number) {
  return 0.06 + 0.94 * (t * t * (3 - 2 * t));
}

export function FadeField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let strands: Strand[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let visible = true;
    let animateUntil = 0;
    let pointer = { x: -9999, y: -9999, active: false };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.ceil(width / GAP);
      strands = Array.from({ length: count }, (_, i) => ({
        x: i * GAP + GAP / 2,
        base: fadeCurve(i / Math.max(count - 1, 1)),
        cut: 0,
        v: 0,
        phase: (i * 2.399) % (Math.PI * 2),
      }));
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const isAnimating = !reduce && time < animateUntil;
      const sway = isAnimating ? Math.sin(time / 1400) : 0;
      for (const s of strands) {
        if (pointer.active && !reduce) {
          const dx = Math.abs(s.x - pointer.x);
          if (dx < TRIM_RADIUS) {
            const target = (1 - dx / TRIM_RADIUS) * 0.55;
            if (target > s.cut) s.cut = target;
          }
        }
        s.v = (s.v - s.cut * 0.035) * 0.86;
        s.cut = Math.max(0, s.cut + s.v);

        const len = height * s.base * (1 - s.cut);
        const lean = sway * 3 * s.base + Math.sin(time / 900 + s.phase) * (isAnimating ? 1.2 : 0);
        const alpha = 0.18 + 0.62 * s.base;
        ctx.strokeStyle = `rgba(230, 232, 235, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(s.x, height);
        ctx.quadraticCurveTo(s.x, height - len * 0.6, s.x + lean, height - len);
        ctx.stroke();
      }
    };

    const loop = (time: number) => {
      draw(time);
      if (visible && !reduce && time < animateUntil) {
        frame = requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running || reduce || !visible) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      const inside = e.clientY >= rect.top && e.clientY <= rect.bottom && e.clientX >= rect.left && e.clientX <= rect.right;
      if (!inside && !pointer.active) return;
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: inside };
      animateUntil = performance.now() + (inside ? 1800 : 600);
      start();
    };

    const ro = new ResizeObserver(() => {
      build();
      draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && document.visibilityState === "visible";
      if (visible && !reduce && performance.now() < animateUntil) start();
    });
    io.observe(canvas);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible && !reduce && performance.now() < animateUntil) start();
    };

    build();
    draw(performance.now());
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      running = false;
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`block h-full w-full ${className}`} />;
}
