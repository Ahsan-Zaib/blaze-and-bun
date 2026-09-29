import { useState } from "react";
import { Clock, MapPin, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BranchPicker } from "./BranchPicker";
import { isOpenNow } from "@/data/branches";
import { useStore } from "@/lib/store";

/** Persistent reminder of which kitchen the guest is ordering from. */
export function BranchStrip() {
  const { branch, ready, orderType, setOrderType } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="border-y border-border bg-card/50">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-gold" aria-hidden />
          {ready && branch ? (
            <span>
              Ordering from <strong>{branch.name}</strong> · {branch.distanceKm} km
            </span>
          ) : (
            <span className="text-muted-foreground">No branch selected yet</span>
          )}
        </div>

        {ready && branch ? (
          <>
            <Badge variant={isOpenNow(branch) ? "default" : "secondary"}>
              {isOpenNow(branch) ? "Open now" : "Closed"}
            </Badge>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="size-4" aria-hidden /> {branch.opensAt}–{branch.closesAt}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Truck className="size-4" aria-hidden />
              {branch.delivery ? `Delivery ~${branch.deliveryMinutes} min` : "Delivery unavailable"}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Store className="size-4" aria-hidden />
              {branch.pickup ? `Pickup ~${branch.prepMinutes} min` : "Pickup unavailable"}
            </span>
          </>
        ) : null}

        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-full border border-border p-0.5" role="group" aria-label="Order type">
            {(["delivery", "pickup", "dinein"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setOrderType(t)}
                aria-pressed={orderType === t}
                className={
                  orderType === t
                    ? "rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
                    : "rounded-full px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                {t === "dinein" ? "Dine-in" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
            Change
          </Button>
        </div>
      </div>
      <BranchPicker open={open} onOpenChange={setOpen} />
    </div>
  );
}
