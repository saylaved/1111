"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/data";

const ITEMS = [
  { id: "top", label: "Головна" },
  { id: "masters", label: "Майстри" },
  { id: "book", label: "Запис" },
  { id: "scanner", label: "AI-підбір" },
  { id: "prices", label: "Ціни" },
];

export function Dock() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Швидка навігація"
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 lg:hidden"
    >
      <ul className="mx-auto flex max-w-md items-center justify-between rounded-full border border-rule bg-graphite/80 p-1.5 backdrop-blur-xl backdrop-saturate-150">
        {ITEMS.map((item) => {
          if (item.id === "book") {
            return (
              <li key={item.id}>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center rounded-full bg-chrome px-5 text-sm font-medium text-void"
                >
                  {item.label}
                </a>
              </li>
            );
          }
          const isActive = active === item.id;
          return (
            <li key={item.id} className="relative">
              {isActive && (
                <motion.span
                  layoutId="dock-pill"
                  className="absolute inset-0 rounded-full bg-rule"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`relative flex h-11 items-center px-3 text-xs transition-colors duration-300 ${
                  isActive ? "text-chrome" : "text-steel"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
