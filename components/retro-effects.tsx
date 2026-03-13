"use client";

import { useEffect, useState } from "react";

type CursorState = {
  x: number;
  y: number;
  active: boolean;
};

export function RetroEffects() {
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    active: false
  });

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      setCursor({
        x: event.clientX,
        y: event.clientY,
        active: true
      });
    }

    function handlePointerLeave() {
      setCursor((current) => ({ ...current, active: false }));
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <>
      <div className="retro-grid" aria-hidden="true" />
      <div className="retro-scanlines" aria-hidden="true" />
      <div className="retro-noise" aria-hidden="true" />

      <div
        aria-hidden="true"
        className={`retro-cursor-glow ${cursor.active ? "opacity-100" : "opacity-0"}`}
        style={{
          left: `${cursor.x}px`,
          top: `${cursor.y}px`
        }}
      />

      <div className="retro-hud" aria-hidden="true">
        <span>APPLYX GROW</span>
        <span>
          {String(Math.round(cursor.x)).padStart(4, "0")},{String(Math.round(cursor.y)).padStart(4, "0")}
        </span>
      </div>
    </>
  );
}
