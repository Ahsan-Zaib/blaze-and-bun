import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Minus, Pencil, Plus, ShoppingBag, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { BranchStrip } from "@/components/site/BranchStrip";
import { CustomizeDialog } from "@/components/site/CustomizeDialog";
import { TipPicker } from "@/components/site/TipPicker";
import { getProduct } from "@/data/menu";
import { lineTotal, money } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { CartItem } from "@/data/types";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Blaze & Bun" },
      { name: "description", content: "Review your Blaze & Bun order, edit customizations, apply a promo code and add a tip for the crew." },
      { property: "og:title", content: "Your Bag — Blaze & Bun" },
      { property: "og:description", content: "Review your order before checkout." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const {
    cart,
    ready,
    updateItem,
    removeItem,
    subtotal,
    deliveryFee,
    discount,
    tip,
    total,
    applyPromo,
    clearPromo,
    promoCode,
    promoLabel,
    orderType,
    play,
  } = useStore();

  const [code, setCode] = useState("");
  const [editing, setEditing] = useState<CartItem | null>(null);
  const [orderNote, setOrderNote] = useState("");

  if (ready && cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto size-12 text-muted-foreground" aria-hidden />
        <h1 className="mt-6 text-5xl">Your bag is empty</h1>
        <p className="mt-3 text-muted-foreground">Nothing on the grill yet. Let's fix that.</p>
        <Button asChild size="lg" className="mt-7">
          <Link to="/menu">Browse the menu</Link>
        </Button>
      </div>
    );
  }

  const editingProduct = editing ? (getProduct(editing.productId) ?? null) : null;

  return (
    <>
      <BranchStrip />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-6xl">Your bag</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <section aria-label="Items">
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item.lineId} className="surface-card flex gap-4 rounded-2xl p-4 reveal-up">
                  <img src={item.image} alt={item.name} loading="lazy" width={96} height={96} className="size-24 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h2 className="text-2xl">{item.name}</h2>
                      <p className="font-display text-2xl tabular-nums">{money(lineTotal(item))}</p>
                    </div>

                    {item.options.length > 0 ? (
                      <ul className="mt-1 text-sm text-muted-foreground">
                        {item.options.map((o) => (
                          <li key={`${o.groupId}-${o.choiceId}`}>
                            {o.label}
                            {o.price > 0 ? <span className="text-gold"> +{money(o.price)}</span> : null}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">No customizations</p>
                    )}

                    {item.notes ? (
                      <p className="mt-2 rounded-lg bg-secondary/60 px-3 py-2 text-sm">“{item.notes}”</p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1 rounded-full border border-border p-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() =>
                            item.quantity === 1
                              ? removeItem(item.lineId)
                              : updateItem(item.lineId, { quantity: item.quantity - 1 })
                          }
                        >
                          <Minus className="size-4" aria-hidden />
                        </Button>
                        <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full"
                          aria-label={`Increase quantity of ${item.name}`}
                          onClick={() => {
                            updateItem(item.lineId, { quantity: Math.min(20, item.quantity + 1) });
                            play("add");
                          }}
                        >
                          <Plus className="size-4" aria-hidden />
                        </Button>
                      </div>

                      <Button variant="ghost" size="sm" onClick={() => setEditing(item)}>
                        <Pencil className="size-4" aria-hidden /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          removeItem(item.lineId);
                          toast.success(`${item.name} removed.`);
                        }}
                      >
                        <Trash2 className="size-4" aria-hidden /> Remove
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link to="/menu">Add more items</Link>
              </Button>
            </div>

            <div className="mt-8">
              <Label htmlFor="order-note" className="font-display text-xl">Note for the kitchen</Label>
              <Textarea
                id="order-note"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Anything about the whole order? e.g. ring the top bell, leave at reception"
                className="mt-2"
                rows={3}
              />
            </div>

            <div className="mt-8">
              <TipPicker />
            </div>
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="surface-card rounded-2xl p-6">
              <h2 className="text-3xl">Order summary</h2>

              <form
                className="mt-5 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const result = applyPromo(code);
                  if (result.ok) {
                    toast.success(result.message);
                    setCode("");
                  } else {
                    toast.error(result.message);
                  }
                }}
              >
                <div className="flex-1">
                  <Label htmlFor="promo" className="sr-only">Promo code</Label>
                  <Input id="promo" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code" />
                </div>
                <Button type="submit" variant="secondary">Apply</Button>
              </form>

              {promoCode && promoLabel ? (
                <p className="mt-3 flex items-center gap-2 text-sm text-fresh">
                  <Tag className="size-4" aria-hidden /> {promoLabel}
                  <button type="button" onClick={clearPromo} className="ml-auto text-muted-foreground underline">
                    remove
                  </button>
                </p>
              ) : null}

              <Separator className="my-5" />

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{money(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    {orderType === "delivery" ? "Delivery fee" : "Pickup"}
                  </dt>
                  <dd className="tabular-nums">{deliveryFee > 0 ? money(deliveryFee) : "Free"}</dd>
                </div>
                {discount > 0 ? (
                  <div className="flex justify-between text-fresh">
                    <dt>Discount</dt>
                    <dd className="tabular-nums">−{money(discount)}</dd>
                  </div>
                ) : null}
                {tip > 0 ? (
                  <div className="flex justify-between">
                    <dt className="flex items-center gap-1.5 text-muted-foreground">
                      <Heart className="size-3.5 text-primary" aria-hidden /> For the crew
                    </dt>
                    <dd className="tabular-nums">{money(tip)}</dd>
                  </div>
                ) : null}
              </dl>

              <Separator className="my-5" />

              <div className="flex items-baseline justify-between">
                <span className="font-display text-2xl">Total</span>
                <span className="font-display text-4xl tabular-nums text-gold">{money(total)}</span>
              </div>

              <Button asChild size="lg" className="mt-6 w-full glow-ember">
                <Link to="/checkout">Go to checkout</Link>
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Taxes are included in item prices.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <CustomizeDialog
        product={editingProduct}
        {...(editing ? { editLine: editing } : {})}
        open={Boolean(editing)}
        onOpenChange={(v) => {
          if (!v) setEditing(null);
        }}
      />
    </>
  );
}
