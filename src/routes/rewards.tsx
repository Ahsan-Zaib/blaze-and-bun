import { createFileRoute, Link } from "@tanstack/react-router";
import { Gift, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { money } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Every Bite Counts — Blaze & Bun Rewards" },
      { name: "description", content: "Earn 10 points for every $1 at Blaze & Bun and swap them for fries, shakes, burgers and free delivery." },
      { property: "og:title", content: "Every Bite Counts — Blaze & Bun Rewards" },
      { property: "og:description", content: "Earn 10 points for every $1 and redeem them for free food." },
    ],
  }),
  component: RewardsPage,
});

/** DEMO catalogue — swap for a loyalty service when one is connected. */
const REWARDS = [
  { id: "r-fries", name: "Regular fries", cost: 400, blurb: "Golden, salted, unbeatable." },
  { id: "r-drink", name: "Any soft drink", cost: 500, blurb: "Ice cold, your pick." },
  { id: "r-shake", name: "Thick shake", cost: 900, blurb: "Vanilla, chocolate or berry." },
  { id: "r-wings", name: "6 flame wings", cost: 1200, blurb: "Sticky, smoky, glazed." },
  { id: "r-burger", name: "Signature burger", cost: 2000, blurb: "The one that started it all." },
  { id: "r-delivery", name: "Free delivery ×3", cost: 1500, blurb: "On your next three orders." },
];

function RewardsPage() {
  const { points, orders, ready } = useStore();
  const nextTier = 2000;
  const progress = Math.min(100, (points / nextTier) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="font-display text-xl text-gold">Blaze Rewards</p>
      <h1 className="mt-2 text-7xl">Every bite counts</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Earn 10 points for every $1 you spend. Points land the moment your order is placed and never
        expire while you keep ordering.
      </p>

      <div className="surface-card mt-10 rounded-3xl p-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">Your balance</p>
            <p className="font-display text-7xl ember-text">{ready ? points : 0}</p>
            <p className="text-sm text-muted-foreground">points</p>
          </div>
          <div className="min-w-64 flex-1">
            <div className="flex justify-between text-sm">
              <span>Progress to a free signature burger</span>
              <span className="tabular-nums">{Math.min(points, nextTier)} / {nextTier}</span>
            </div>
            <Progress value={progress} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              {points >= nextTier
                ? "You can claim it right now."
                : `${nextTier - points} points to go — about ${money((nextTier - points) / 10)} of food.`}
            </p>
          </div>
        </div>
      </div>

      <h2 className="mt-14 text-4xl">Spend your points</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REWARDS.map((r) => {
          const affordable = points >= r.cost;
          return (
            <li key={r.id} className="surface-card flex flex-col rounded-2xl p-6 reveal-up">
              <Gift className="size-6 text-gold" aria-hidden />
              <h3 className="mt-3 text-2xl">{r.name}</h3>
              <p className="text-sm text-muted-foreground">{r.blurb}</p>
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="secondary">{r.cost} pts</Badge>
                <Button
                  size="sm"
                  disabled={!affordable}
                  onClick={() =>
                    toast.info("Redemption isn't live yet", {
                      description: "Rewards will be claimable once the loyalty system is connected.",
                    })
                  }
                >
                  {affordable ? "Redeem" : "Keep earning"}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <h2 className="mt-14 text-4xl">Your order history</h2>
      {ready && orders.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="surface-card flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5">
              <div>
                <p className="font-display text-2xl">#{o.id}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(o.createdAt).toLocaleString()} · {o.branchName} · {o.items.length} item
                  {o.items.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-sm text-gold">
                  <Star className="size-4" aria-hidden /> +{o.pointsEarned}
                </span>
                <span className="font-display text-2xl tabular-nums">{money(o.total)}</span>
                <Button asChild size="sm" variant="secondary">
                  <Link to="/track/$orderId" params={{ orderId: o.id }}>Track</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="surface-card mt-6 rounded-2xl p-10 text-center">
          <Sparkles className="mx-auto size-8 text-gold" aria-hidden />
          <p className="mt-3 text-muted-foreground">No orders yet — your first one starts the count.</p>
          <Button asChild className="mt-5"><Link to="/menu">Start earning</Link></Button>
        </div>
      )}

      <p className="mt-10 text-xs text-muted-foreground">
        Demo note: points and history are stored in this browser only and reset if you clear site data.
      </p>
    </div>
  );
}
