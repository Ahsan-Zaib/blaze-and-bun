import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Banknote, CreditCard, Info, Smartphone, Store, Truck, Utensils, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TipPicker } from "@/components/site/TipPicker";
import { lineTotal, money } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { OrderType, PaymentMethod } from "@/data/types";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Blaze & Bun" },
      { name: "description", content: "Confirm your details, choose delivery or pickup and place your Blaze & Bun order." },
      { property: "og:title", content: "Checkout — Blaze & Bun" },
      { property: "og:description", content: "Confirm your details and place your order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const orderTypes: Array<{ id: OrderType; label: string; icon: typeof Truck; note: string }> = [
  { id: "delivery", label: "Delivery", icon: Truck, note: "To your door" },
  { id: "pickup", label: "Pickup", icon: Store, note: "Collect at the counter" },
  { id: "dinein", label: "Dine-in", icon: Utensils, note: "Eat with us" },
];

const payments: Array<{ id: PaymentMethod; label: string; icon: typeof CreditCard; note: string }> = [
  { id: "cod", label: "Cash on delivery", icon: Banknote, note: "Pay the rider" },
  { id: "card", label: "Card", icon: CreditCard, note: "Not connected yet" },
  { id: "online", label: "Online payment", icon: Wallet, note: "Not connected yet" },
  { id: "wallet", label: "Mobile wallet", icon: Smartphone, note: "Not connected yet" },
];

function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cart,
    ready,
    branch,
    orderType,
    setOrderType,
    subtotal,
    deliveryFee,
    discount,
    tip,
    total,
    promoCode,
    placeOrder,
    play,
  } = useStore();

  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    instructions: "",
    preferredTime: "asap",
  });

  if (ready && cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-5xl">Nothing to check out</h1>
        <p className="mt-3 text-muted-foreground">Add something delicious first.</p>
        <Button asChild size="lg" className="mt-7"><Link to="/menu">Browse the menu</Link></Button>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!branch) {
      toast.error("Choose a branch first — use the location button in the header.");
      return;
    }
    setSubmitting(true);
    const order = placeOrder({
      branchId: branch.id,
      branchName: branch.name,
      orderType,
      payment,
      customer: {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: orderType === "delivery" ? form.address : undefined,
        instructions: form.instructions || undefined,
        preferredTime: form.preferredTime,
      },
      items: cart,
      subtotal,
      deliveryFee,
      discount,
      promoCode: promoCode ?? undefined,
      tip,
      total,
    });
    play("confirm");
    void navigate({ to: "/order/$orderId", params: { orderId: order.id } });
    setSubmitting(false);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-6xl">Checkout</h1>
      <p className="mt-3 text-muted-foreground">
        {branch ? <>Ordering from <strong>{branch.name}</strong></> : "Pick a branch from the header to continue"}
      </p>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-8">
          <section className="surface-card rounded-2xl p-6" aria-labelledby="type-heading">
            <h2 id="type-heading" className="text-3xl">How do you want it?</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {orderTypes.map((t) => {
                const disabled =
                  (t.id === "delivery" && branch && !branch.delivery) ||
                  (t.id === "pickup" && branch && !branch.pickup) ||
                  (t.id === "dinein" && branch && !branch.dineIn);
                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={Boolean(disabled)}
                    onClick={() => setOrderType(t.id)}
                    aria-pressed={orderType === t.id}
                    className={cn(
                      "rounded-xl border border-border bg-secondary/30 p-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-40",
                      orderType === t.id && "border-primary bg-secondary",
                    )}
                  >
                    <t.icon className="size-5 text-gold" aria-hidden />
                    <p className="mt-2 font-display text-xl">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{disabled ? "Unavailable here" : t.note}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="surface-card rounded-2xl p-6" aria-labelledby="details-heading">
            <h2 id="details-heading" className="text-3xl">Your details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" required type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              {orderType === "delivery" ? (
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Delivery address</Label>
                  <Input
                    id="address"
                    required
                    autoComplete="street-address"
                    placeholder="Street, building, apartment"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              ) : null}
              <div className="sm:col-span-2">
                <Label htmlFor="instructions">Delivery instructions</Label>
                <Textarea
                  id="instructions"
                  rows={2}
                  placeholder="Gate code, floor, where to leave it"
                  value={form.instructions}
                  onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="time">Preferred time</Label>
                <select
                  id="time"
                  value={form.preferredTime}
                  onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                  className="mt-1 h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value="asap">As soon as possible</option>
                  <option value="30">In about 30 minutes</option>
                  <option value="60">In about an hour</option>
                  <option value="120">In about two hours</option>
                </select>
              </div>
            </div>
          </section>

          <section className="surface-card rounded-2xl p-6" aria-labelledby="pay-heading">
            <h2 id="pay-heading" className="text-3xl">Payment</h2>
            <Alert className="mt-4">
              <Info className="size-4" aria-hidden />
              <AlertTitle>No payment provider is connected</AlertTitle>
              <AlertDescription>
                Card, online and wallet options are placeholders in this demo. Choosing cash on
                delivery is the only method that reflects a real flow today.
              </AlertDescription>
            </Alert>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {payments.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPayment(p.id)}
                  aria-pressed={payment === p.id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-4 text-left transition-all",
                    payment === p.id && "border-primary bg-secondary",
                  )}
                >
                  <p.icon className="size-5 text-gold" aria-hidden />
                  <span>
                    <span className="block font-medium">{p.label}</span>
                    <span className="block text-xs text-muted-foreground">{p.note}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <TipPicker />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="surface-card rounded-2xl p-6">
            <h2 className="text-3xl">Order summary</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {cart.map((item) => (
                <li key={item.lineId}>
                  <div className="flex justify-between gap-3">
                    <span>
                      {item.quantity}× {item.name}
                    </span>
                    <span className="tabular-nums">{money(lineTotal(item))}</span>
                  </div>
                  {item.options.length > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      {item.options.map((o) => o.label).join(", ")}
                    </p>
                  ) : null}
                  {item.notes ? <p className="text-xs italic text-muted-foreground">“{item.notes}”</p> : null}
                </li>
              ))}
            </ul>

            <Separator className="my-5" />

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd className="tabular-nums">{deliveryFee > 0 ? money(deliveryFee) : "Free"}</dd></div>
              {discount > 0 ? <div className="flex justify-between text-fresh"><dt>Discount</dt><dd className="tabular-nums">−{money(discount)}</dd></div> : null}
              {tip > 0 ? <div className="flex justify-between"><dt className="text-muted-foreground">For the crew</dt><dd className="tabular-nums">{money(tip)}</dd></div> : null}
            </dl>

            <Separator className="my-5" />

            <div className="flex items-baseline justify-between">
              <span className="font-display text-2xl">Total</span>
              <span className="font-display text-4xl tabular-nums text-gold">{money(total)}</span>
            </div>

            <Button type="submit" size="lg" disabled={submitting} className="mt-6 w-full glow-ember">
              Place order · {money(total)}
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full">
              <Link to="/cart">Back to bag</Link>
            </Button>
          </div>
        </aside>
      </form>
    </div>
  );
}
