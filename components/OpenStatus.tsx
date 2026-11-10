"use client";

import { useEffect, useState } from "react";
import { SHOP } from "@/lib/data";

type Status = { open: boolean; label: string };

const kyivHour = new Intl.DateTimeFormat("uk-UA", {
  timeZone: SHOP.timeZone,
  hour: "numeric",
  minute: "numeric",
  hourCycle: "h23",
});

function readStatus(now: Date): Status {
  const parts = kyivHour.formatToParts(now);
  const h = Number(parts.find((p) => p.type === "hour")?.value);
  const m = Number(parts.find((p) => p.type === "minute")?.value);
  const minutes = h * 60 + m;
  const open = minutes >= SHOP.opens * 60 && minutes < SHOP.closes * 60;
  if (open) return { open, label: `Відчинено до ${SHOP.closes}:00` };
  return { open, label: `Зачинено · відкриємось о ${SHOP.opens}:00` };
}

export function OpenStatus({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    setStatus(readStatus(new Date()));
    const id = window.setInterval(() => setStatus(readStatus(new Date())), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={`inline-flex items-center gap-2 text-sm text-steel ${className}`} aria-live="polite">
      <span className="relative flex size-2" aria-hidden="true">
        {status?.open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-pole/70 motion-reduce:hidden" />
        )}
        <span className={`relative size-2 rounded-full ${status?.open ? "bg-pole" : "bg-steel/60"}`} />
      </span>
      <span className="min-w-[11ch]">{status ? status.label : "Щодня 10:00–20:00"}</span>
    </span>
  );
}
