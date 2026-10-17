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
      if (target.hasAttribute("data-fx-fire")) {
        fireBurst(e.clientX, e.clientY);
        return;
      }
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
    /** Big flame burst: a wall of fire that flares up and burns away. */
    function fireBurst(x: number, y: number) {
      const layer = document.createElement("div");
      layer.className = "fx-layer";
      layer.style.left = `${x}px`;
      layer.style.top = `${y}px`;
      const flash = document.createElement("span");
      flash.className = "fx-fire-flash";
      layer.appendChild(flash);
      for (let i = 0; i < 14; i++) {
        const f = document.createElement("span");
        f.className = "fx-flame";
        f.textContent = ["🔥", "🌶️", "✨"][Math.floor(Math.random() * 3)] ?? "🔥";
        const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
        const d = 40 + Math.random() * 90;
        f.style.setProperty("--dx", `${Math.cos(a) * d}px`);
        f.style.setProperty("--dy", `${Math.sin(a) * d - 30}px`);
        f.style.setProperty("--fs", `${14 + Math.random() * 22}px`);
        f.style.animationDelay = `${Math.random() * 0.12}s`;
        f.setAttribute("aria-hidden", "true");
        layer.appendChild(f);
      }
      for (let i = 0; i < 10; i++) {
        const s = document.createElement("span");
        s.className = "fx-spark";
        const a = Math.random() * Math.PI * 2;
        const d = 30 + Math.random() * 50;
        s.style.setProperty("--dx", `${Math.cos(a) * d}px`);
        s.style.setProperty("--dy", `${Math.sin(a) * d}px`);
        layer.appendChild(s);
      }
      document.body.appendChild(layer);
      setTimeout(() => layer.remove(), 1100);
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
