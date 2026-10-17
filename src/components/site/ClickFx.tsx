import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

const FOODS = ["🍔", "🍟", "🍕", "🌶️", "🔥", "🍗", "🥤"];

/** Global click effect: ember sparks + a tiny food pop on every button/link press. */
export function ClickFx() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    function onDown(e: PointerEvent) {
      const target = (e.target as HTMLElement | null)?.closest("button, a, [role=button], [role=tab]");
      if (!target) return;
      const layer = document.createElement("div");
      layer.className = "fx-layer";
      layer.style.left = `${e.clientX}px`;
      layer.style.top = `${e.clientY}px`;
      const ring = document.createElement("span");
      ring.className = "fx-ring";
      layer.appendChild(ring);
      for (let i = 0; i < 8; i++) {
        const s = document.createElement("span");
        s.className = "fx-spark";
        const a = (Math.PI * 2 * i) / 8 + Math.random() * 0.5;
        const d = 22 + Math.random() * 18;
        s.style.setProperty("--dx", `${Math.cos(a) * d}px`);
        s.style.setProperty("--dy", `${Math.sin(a) * d}px`);
        layer.appendChild(s);
      }
      const food = document.createElement("span");
      food.className = "fx-food";
      food.textContent = FOODS[Math.floor(Math.random() * FOODS.length)] ?? "🔥";
      food.setAttribute("aria-hidden", "true");
      layer.appendChild(food);
      document.body.appendChild(layer);
      setTimeout(() => layer.remove(), 800);
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
  return null;
}

/** Re-plays a sizzling entrance whenever the page changes. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
