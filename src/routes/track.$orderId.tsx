import { useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bike, ChefHat, CheckCircle2, ClipboardCheck, Flame, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { money } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/data/types";

export const Route = createFileRoute("/track/$orderId")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Track Your Order — Blaze & Bun" },
      { name: "description", content: "Follow your Blaze & Bun order from the grill to your door." },
      { property: "og:title", content: "Track Your Order — Blaze & Bun" },
      { property: "og:description", content: "Follow your order from the grill to your door." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TrackPage,
});

const STEPS: Array<{ id: OrderStatus; label: string; blurb: string; icon: typeof Flame }> = [
  { id: "received", label: "Order received", blurb: "The kitchen has your ticket.", icon: ClipboardCheck },
  { id: "accepted", label: "Accepted", blurb: "Everything is in stock and priced up.", icon: CheckCircle2 },
  { id: "preparing", label: "Preparing", blurb: "On the flame grill right now.", icon: ChefHat },
  { id: "ready", label: "Ready", blurb: "Boxed, bagged and sealed.", icon: PackageCheck },
  { id: "out_for_delivery", label: "On the way", blurb: "Your rider is heading over.", icon: Bike },
  { id: "delivered", label: "Delivered", blurb: "Enjoy every bite.", icon: Flame },
];

function TrackPage() {
  const { orderId } = Route.useParams();
  const { getOrder, advanceOrder, ready } = useStore();
  const order = getOrder(orderId);
  const status = order?.status;

  const index = useMemo(() => STEPS.findIndex((s) => s.id === status), [status]);

  // DEMO ONLY: no kitchen system is connected, so the status advances on a timer.
  useEffect(() => {
    if (!order || index < 0 || index >= STEPS.length - 1) return;
    const next = STEPS[index + 1]!.id;
    const t = setTimeout(() => advanceOrder(order.id, next), 12000);
    return () => clearTimeout(t);
  }, [order, index, advanceOrder]);

  if (!ready) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted-foreground">Loading…</div>;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-5xl">Order not found</h1>
        <p className="mt-3 text-muted-foreground">
          Demo orders live in this browser only. Place an order to see tracking in action.
        </p>
        <Button asChild className="mt-6"><Link to="/menu">Browse the menu</Link></Button>
      </div>
    );
  }

  const etaMinutes = order.orderType === "delivery" ? 32 : 18;
  const done = order.status === "delivered";

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <p className="font-display text-xl text-gold">Order #{order.id}</p>
      <h1 className="mt-2 text-6xl">{done ? "Delivered" : "On its way"}</h1>
      <p className="mt-3 text-muted-foreground">
        {done
          ? `Completed from ${order.branchName}.`
          : `Estimated ${order.orderType === "delivery" ? "delivery" : "pickup"} in about ${etaMinutes} minutes from ${order.branchName}.`}
      </p>

      <Alert className="mt-6">
        <Flame className="size-4" aria-hidden />
        <AlertTitle>This tracking is simulated</AlertTitle>
        <AlertDescription>
          No kitchen or courier system is connected yet, so each step advances automatically to show
          how live tracking will look.
        </AlertDescription>
      </Alert>

      <ol className="mt-10 space-y-1" aria-live="polite">
        {STEPS.map((step, i) => {
          const state = i < index ? "done" : i === index ? "active" : "todo";
          return (
            <li key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full border transition-all",
                    state === "todo" && "border-border text-muted-foreground",
                    state === "done" && "border-fresh bg-fresh/15 text-fresh",
                    state === "active" && "border-primary bg-primary text-primary-foreground glow-ember",
                  )}
                >
                  <step.icon className={cn("size-5", state === "active" && "animate-pulse")} aria-hidden />
                </span>
                {i < STEPS.length - 1 ? (
                  <span className={cn("h-12 w-0.5", i < index ? "bg-fresh" : "bg-border")} />
                ) : null}
              </div>
              <div className="pb-2 pt-2">
                <p className={cn("font-display text-2xl", state === "todo" && "text-muted-foreground")}>
                  {step.label}
                </p>
                <p className="text-sm text-muted-foreground">{step.blurb}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="surface-card mt-10 rounded-2xl p-6">
        <h2 className="text-3xl">Order details</h2>
        <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
          {order.items.map((i) => (
            <li key={i.lineId}>{i.quantity}× {i.name}</li>
          ))}
        </ul>
        <p className="mt-4 font-display text-2xl">
          Total <span className="text-gold">{money(order.total)}</span>
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild variant="secondary"><Link to="/menu">Order again</Link></Button>
        <Button asChild variant="ghost"><Link to="/rewards">My rewards</Link></Button>
      </div>
    </div>
  );
}
