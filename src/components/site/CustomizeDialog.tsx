import { useEffect, useMemo, useState } from "react";
import { Flame, Leaf, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { money } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { CartItem, Product, SelectedOption } from "@/data/types";

function defaultSelection(product: Product): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const g of product.optionGroups) out[g.id] = g.defaults ? [...g.defaults] : [];
  return out;
}

export function CustomizeDialog({
  product,
  open,
  onOpenChange,
  editLine,
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editLine?: CartItem;
}) {
  const { addItem, updateItem, play } = useStore();
  const [selection, setSelection] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open || !product) return;
    if (editLine) {
      const map: Record<string, string[]> = {};
      for (const g of product.optionGroups) map[g.id] = [];
      for (const o of editLine.options) map[o.groupId] = [...(map[o.groupId] ?? []), o.choiceId];
      setSelection(map);
      setQuantity(editLine.quantity);
      setNotes(editLine.notes ?? "");
    } else {
      setSelection(defaultSelection(product));
      setQuantity(1);
      setNotes("");
    }
  }, [open, product, editLine]);

  const options: SelectedOption[] = useMemo(() => {
    if (!product) return [];
    const out: SelectedOption[] = [];
    for (const g of product.optionGroups) {
      for (const id of selection[g.id] ?? []) {
        const c = g.choices.find((x) => x.id === id);
        if (!c) continue;
        if (c.price === 0 && (c.id === "none" || c.id === "regular" || c.id === "single")) continue;
        out.push({ groupId: g.id, groupTitle: g.title, choiceId: c.id, label: c.label, price: c.price });
      }
    }
    return out;
  }, [product, selection]);

  if (!product) return null;

  const unitPrice = product.price + options.reduce((s, o) => s + o.price, 0);
  const total = unitPrice * quantity;

  function toggle(groupId: string, choiceId: string, type: "single" | "multi", max?: number) {
    setSelection((s) => {
      const current = s[groupId] ?? [];
      if (type === "single") return { ...s, [groupId]: [choiceId] };
      if (current.includes(choiceId))
        return { ...s, [groupId]: current.filter((c) => c !== choiceId) };
      if (max && current.length >= max) {
        toast.info(`You can pick up to ${max} here.`);
        return s;
      }
      return { ...s, [groupId]: [...current, choiceId] };
    });
  }

  function submit() {
    const payload = {
      productId: product!.id,
      name: product!.name,
      image: product!.image,
      basePrice: product!.price,
      quantity,
      options,
      notes: notes.trim() || undefined,
    };
    if (editLine) {
      updateItem(editLine.lineId, payload);
      toast.success("Your item was updated.");
    } else {
      addItem(payload);
      play("add");
      toast.success(`${product!.name} added to your bag.`);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <div className="grid max-h-[90vh] grid-rows-[auto_1fr_auto] overflow-hidden">
          <DialogHeader className="space-y-0 border-b border-border p-0 text-left">
            <div className="flex gap-4 p-4 sm:p-6">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                width={120}
                height={120}
                className="size-24 shrink-0 rounded-xl object-cover sm:size-28"
              />
              <div className="min-w-0">
                <DialogTitle className="font-display text-3xl">
                  Customize your {product.name.split(" ").slice(-1)[0].toLowerCase()}
                </DialogTitle>
                <DialogDescription className="line-clamp-2">{product.description}</DialogDescription>
                <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>{product.calories} kcal</span>
                  {product.vegetarian ? (
                    <span className="flex items-center gap-1 text-fresh"><Leaf className="size-3.5" aria-hidden /> Vegetarian</span>
                  ) : null}
                  {product.spiceLevel > 0 ? (
                    <span className="flex items-center gap-1 text-primary">
                      {Array.from({ length: product.spiceLevel }).map((_, i) => (
                        <Flame key={i} className="size-3.5" aria-hidden />
                      ))}
                      Spice level {product.spiceLevel}/3
                    </span>
                  ) : null}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto px-4 py-5 sm:px-6">
            {product.optionGroups.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This one comes just the way it is. Add a note below if you need anything special.
              </p>
            ) : null}

            {product.optionGroups.map((group) => (
              <fieldset key={group.id} className="mb-7">
                <legend className="mb-1 font-display text-xl">
                  {group.title}
                  {group.required ? <span className="ml-2 text-xs text-gold">Required</span> : null}
                </legend>
                {group.description ? (
                  <p className="mb-3 text-xs text-muted-foreground">{group.description}</p>
                ) : null}
                <div className="grid gap-2 sm:grid-cols-2">
                  {group.choices.map((choice) => {
                    const checked = (selection[group.id] ?? []).includes(choice.id);
                    const inputId = `${group.id}-${choice.id}`;
                    return (
                      <div
                        key={choice.id}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-3 py-3 transition-all",
                          checked && "border-primary bg-secondary shadow-[0_0_0_1px_var(--color-primary)]",
                        )}
                      >
                        <Checkbox
                          id={inputId}
                          checked={checked}
                          onCheckedChange={() => toggle(group.id, choice.id, group.type, group.maxSelections)}
                          className={group.type === "single" ? "rounded-full" : undefined}
                        />
                        <Label htmlFor={inputId} className="flex flex-1 cursor-pointer items-center justify-between gap-2">
                          <span>
                            {choice.label}
                            {choice.note ? (
                              <span className="block text-xs font-normal text-muted-foreground">{choice.note}</span>
                            ) : null}
                          </span>
                          <span className={cn("text-sm", choice.price > 0 ? "text-gold" : "text-muted-foreground")}>
                            {choice.price > 0 ? `+${money(choice.price)}` : "Free"}
                          </span>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <Separator className="my-5" />

            <Label htmlFor="special-instructions" className="font-display text-xl">
              Special instructions
            </Label>
            <Textarea
              id="special-instructions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything else we should know? e.g. extra crispy, sauce on the side"
              className="mt-2"
              rows={3}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-border bg-card p-4 sm:p-5">
            <div className="flex items-center gap-1 rounded-full border border-border p-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" aria-hidden />
              </Button>
              <span className="w-8 text-center font-semibold" aria-live="polite">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                aria-label="Increase quantity"
              >
                <Plus className="size-4" aria-hidden />
              </Button>
            </div>
            <Button onClick={submit} size="lg" className="ml-auto flex-1 sm:flex-none">
              {editLine ? "Save changes" : "Add to bag"} · <span className="tabular-nums">{money(total)}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
