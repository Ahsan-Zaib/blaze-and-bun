import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { money } from "@/lib/format";
import { useStore } from "@/lib/store";

const HIDDEN_ON = ["/cart", "/checkout"];

/** Floating order bar — always one tap from the bag on mobile. */
export function OrderBar() {
  const { itemCount, subtotal, ready } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!ready || itemCount === 0 || HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 sm:p-5">
      <Link
        to="/cart"
        className="pointer-events-auto mx-auto flex max-w-md items-center gap-3 rounded-full bg-primary px-5 py-3.5 text-primary-foreground shadow-[var(--shadow-ember)] transition-transform hover:scale-[1.02]"
      >
        <ShoppingBag className="size-5" aria-hidden />
        <span className="font-semibold">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your bag
        </span>
        <span className="ml-auto font-display text-xl tabular-nums">{money(subtotal)}</span>
      </Link>
    </div>
  );
}
