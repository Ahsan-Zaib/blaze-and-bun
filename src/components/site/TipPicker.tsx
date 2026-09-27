import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { money } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const PERCENTS = [5, 10, 15];

/** Optional contribution for the kitchen and rider crew. Always skippable. */
export function TipPicker() {
  const { tipPercent, tipCustom, setTipPercent, setTipCustom, tip, subtotal } = useStore();
  const [customOpen, setCustomOpen] = useState(tipCustom != null);
  const [customValue, setCustomValue] = useState(tipCustom ? String(tipCustom) : "");

  return (
    <section className="surface-card rounded-2xl p-6" aria-labelledby="tip-heading">
      <h2 id="tip-heading" className="flex items-center gap-2 text-3xl">
        <Heart className="size-6 text-primary" aria-hidden /> Send a little extra love
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Completely optional. Anything you add is shared across the kitchen and delivery crew working
        your order — it isn't assigned to one person.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setTipPercent(null);
            setCustomOpen(false);
          }}
          aria-pressed={tipPercent == null && tipCustom == null}
          className={cn(
            "rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors",
            tipPercent == null && tipCustom == null
              ? "border-primary bg-primary text-primary-foreground"
              : "hover:border-gold",
          )}
        >
          No thanks
        </button>
        {PERCENTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setTipPercent(p);
              setCustomOpen(false);
            }}
            aria-pressed={tipPercent === p}
            className={cn(
              "rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors",
              tipPercent === p ? "border-primary bg-primary text-primary-foreground" : "hover:border-gold",
            )}
          >
            {p}% <span className="opacity-70">({money((subtotal * p) / 100)})</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setCustomOpen(true)}
          aria-pressed={tipCustom != null}
          className={cn(
            "rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors",
            tipCustom != null ? "border-primary bg-primary text-primary-foreground" : "hover:border-gold",
          )}
        >
          Custom amount
        </button>
      </div>

      {customOpen ? (
        <div className="mt-4 flex max-w-xs items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="custom-tip">Your amount</Label>
            <Input
              id="custom-tip"
              type="number"
              min={0}
              step="0.5"
              inputMode="decimal"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder="2.00"
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              const v = Number.parseFloat(customValue);
              setTipCustom(Number.isFinite(v) && v > 0 ? Math.round(v * 100) / 100 : null);
            }}
          >
            Add
          </Button>
        </div>
      ) : null}

      {tip > 0 ? (
        <p className="mt-4 text-sm text-fresh" aria-live="polite">
          Thank you — {money(tip)} added for the crew. ☕
        </p>
      ) : null}
    </section>
  );
}
