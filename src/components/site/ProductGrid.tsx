import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { CustomizeDialog } from "./CustomizeDialog";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/types";

export function ProductGrid({
  products,
  className,
  animate = true,
}: {
  products: Product[];
  className?: string;
  animate?: boolean;
}) {
  const [active, setActive] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  function customize(p: Product) {
    setActive(p);
    setOpen(true);
  }

  return (
    <>
      <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)}>
        {products.map((p, i) =>
          animate ? (
            <Reveal key={p.id} delay={Math.min(i, 6) * 60} className="h-full">
              <ProductCard product={p} onCustomize={customize} className="h-full" />
            </Reveal>
          ) : (
            <ProductCard key={p.id} product={p} onCustomize={customize} className="h-full" />
          ),
        )}
      </div>
      <CustomizeDialog product={active} open={open} onOpenChange={setOpen} />
    </>
  );
}
