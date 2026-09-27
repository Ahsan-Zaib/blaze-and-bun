import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, MapPin, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { lineTotal, money } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/order/$orderId")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Blaze & Bun" },
      { name: "description", content: "Your Blaze & Bun order is confirmed. See your receipt and track it to the door." },
      { property: "og:title", content: "Order Confirmed — Blaze & Bun" },
      { property: "og:description", content: "Your order is confirmed." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmation,
});

function OrderConfirmation() {
  const { orderId } = Route.useParams();
  const { getOrder, ready } = useStore();
  const order = getOrder(orderId);

  if (!ready) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted-foreground">Loading your receipt…</div>;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-5xl">We can't find that order</h1>
        <p className="mt-3 text-muted-foreground">
          Orders in this demo are stored in this browser only, so they won't appear on another device.
        </p>
        <Button asChild className="mt-6"><Link to="/menu">Start a new order</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <div className="text-center reveal-up">
        <CheckCircle2 className="mx-auto size-16 text-fresh" aria-hidden />
        <h1 className="mt-5 text-6xl">Order confirmed</h1>
        <p className="mt-3 text-muted-foreground">
          Thanks {order.customer.name || "friend"} — {order.branchName} has your order.
        </p>
        <p className="mt-1 font-display text-3xl text-gold">#{order.id}</p>
      </div>

      <div className="surface-card mt-10 rounded-2xl p-6">
        <h2 className="flex items-center gap-2 text-3xl"><Receipt className="size-6 text-primary" aria-hidden /> Your receipt</h2>

        <ul className="mt-5 space-y-3 text-sm">
          {order.items.map((item) => (
            <li key={item.lineId}>
              <div className="flex justify-between gap-3">
                <span>{item.quantity}× {item.name}</span>
                <span className="tabular-nums">{money(lineTotal(item))}</span>
              </div>
              {item.options.length > 0 ? (
                <p className="text-xs text-muted-foreground">{item.options.map((o) => o.label).join(", ")}</p>
              ) : null}
              {item.notes ? <p className="text-xs italic text-muted-foreground">“{item.notes}”</p> : null}
            </li>
          ))}
        </ul>

        <Separator className="my-5" />

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">{money(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd className="tabular-nums">{order.deliveryFee > 0 ? money(order.deliveryFee) : "Free"}</dd></div>
          {order.discount > 0 ? <div className="flex justify-between text-fresh"><dt>Discount {order.promoCode ? `(${order.promoCode})` : ""}</dt><dd className="tabular-nums">−{money(order.discount)}</dd></div> : null}
          {order.tip > 0 ? <div className="flex justify-between"><dt className="text-muted-foreground">For the crew</dt><dd className="tabular-nums">{money(order.tip)}</dd></div> : null}
        </dl>

        <Separator className="my-5" />

        <div className="flex items-baseline justify-between">
          <span className="font-display text-2xl">Paid / due</span>
          <span className="font-display text-4xl tabular-nums text-gold">{money(order.total)}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {order.payment === "cod"
            ? "Cash on delivery — have it ready for the rider."
            : "Payment method selected as a placeholder; no provider is connected in this demo."}
        </p>

        <Separator className="my-5" />

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 text-gold" aria-hidden />
            <span>
              {order.orderType === "delivery"
                ? order.customer.address
                : order.orderType === "pickup"
                  ? `Pickup at ${order.branchName}`
                  : `Dine-in at ${order.branchName}`}
            </span>
          </p>
          <p className="text-muted-foreground">
            You earned <strong className="text-gold">{order.pointsEarned} points</strong> on this order.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" className="glow-ember">
          <Link to="/track/$orderId" params={{ orderId: order.id }}>Track my order</Link>
        </Button>
        <Button asChild variant="secondary" size="lg"><Link to="/menu">Order something else</Link></Button>
        <Button asChild variant="ghost" size="lg"><Link to="/rewards">See my rewards</Link></Button>
      </div>
    </div>
  );
}
