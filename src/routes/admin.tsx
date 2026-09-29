import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, BarChart3, Boxes, Building2, Info, Pencil, Plus, Tag, Trash2, Users, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { branches as seedBranches } from "@/data/branches";
import { customers } from "@/data/customers";
import { deals, promoCodes } from "@/data/deals";
import { IMAGES, products as seedProducts } from "@/data/menu";
import { money } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Branch, OrderStatus, Product } from "@/data/types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Staff Dashboard — Blaze & Bun" },
      { name: "description", content: "Manage the Blaze & Bun menu, stock, live orders, branches, discounts, customers and sales performance." },
      { property: "og:title", content: "Staff Dashboard — Blaze & Bun" },
      { property: "og:description", content: "Manage menu, stock, orders, branches and performance." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const STATUSES: OrderStatus[] = ["received", "accepted", "preparing", "ready", "out_for_delivery", "delivered"];

const statusLabel: Record<OrderStatus, string> = {
  received: "New",
  accepted: "Accepted",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "On the way",
  delivered: "Completed",
};

function AdminPage() {
  const { orders, advanceOrder } = useStore();
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [branchList, setBranchList] = useState<Branch[]>(seedBranches);
  const [stock, setStock] = useState<Record<string, number>>(() =>
    Object.fromEntries(seedProducts.map((p, i) => [p.id, [0, 3, 8, 24, 47, 62][i % 6]!])),
  );
  const [editing, setEditing] = useState<Product | null>(null);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const lowStock = useMemo(
    () => products.filter((p) => (stock[p.id] ?? 0) <= 5),
    [products, stock],
  );

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length ? revenue / orders.length : 0;

  const popular = useMemo(() => {
    const counts = new Map<string, number>();
    for (const o of orders) for (const i of o.items) counts.set(i.name, (counts.get(i.name) ?? 0) + i.quantity);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [orders]);

  const perBranch = useMemo(() => {
    const map = new Map<string, { orders: number; revenue: number }>();
    for (const o of orders) {
      const cur = map.get(o.branchName) ?? { orders: 0, revenue: 0 };
      map.set(o.branchName, { orders: cur.orders + 1, revenue: cur.revenue + o.total });
    }
    return [...map.entries()].sort((a, b) => b[1].revenue - a[1].revenue);
  }, [orders]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-6xl">Staff dashboard</h1>
      <Alert className="mt-5">
        <Info className="size-4" aria-hidden />
        <AlertTitle>Demo workspace</AlertTitle>
        <AlertDescription>
          Menu, stock, branch and discount edits here apply to this browser session only. Live
          orders are the ones you placed on this device. Connecting a database makes all of it permanent.
        </AlertDescription>
      </Alert>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Orders" value={String(orders.length)} />
        <Kpi label="Revenue" value={money(revenue)} />
        <Kpi label="Average order" value={money(avgOrder)} />
        <Kpi label="Low / out of stock" value={String(lowStock.length)} />
      </div>

      <Tabs defaultValue="orders" className="mt-10">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="orders"><Boxes className="mr-1.5 size-4" aria-hidden />Orders</TabsTrigger>
          <TabsTrigger value="products"><UtensilsCrossed className="mr-1.5 size-4" aria-hidden />Products</TabsTrigger>
          <TabsTrigger value="inventory"><AlertTriangle className="mr-1.5 size-4" aria-hidden />Inventory</TabsTrigger>
          <TabsTrigger value="branches"><Building2 className="mr-1.5 size-4" aria-hidden />Branches</TabsTrigger>
          <TabsTrigger value="discounts"><Tag className="mr-1.5 size-4" aria-hidden />Discounts</TabsTrigger>
          <TabsTrigger value="customers"><Users className="mr-1.5 size-4" aria-hidden />Customers</TabsTrigger>
          <TabsTrigger value="analytics"><BarChart3 className="mr-1.5 size-4" aria-hidden />Analytics</TabsTrigger>
        </TabsList>

        {/* ORDERS */}
        <TabsContent value="orders" className="mt-6">
          {orders.length === 0 ? (
            <Empty text="No orders yet. Place one from the customer site and it appears here instantly." />
          ) : (
            <ul className="space-y-4">
              {orders.map((o) => (
                <li key={o.id} className="surface-card rounded-2xl p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-2xl">#{o.id} <Badge variant="secondary">{statusLabel[o.status]}</Badge></p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(o.createdAt).toLocaleString()} · {o.branchName} · {o.orderType} · {o.payment}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {o.customer.name} · {o.customer.phone}
                        {o.customer.address ? ` · ${o.customer.address}` : ""}
                      </p>
                    </div>
                    <p className="font-display text-3xl text-gold">{money(o.total)}</p>
                  </div>

                  <ul className="mt-3 space-y-1 text-sm">
                    {o.items.map((i) => (
                      <li key={i.lineId}>
                        {i.quantity}× {i.name}
                        {i.options.length ? <span className="text-muted-foreground"> — {i.options.map((x) => x.label).join(", ")}</span> : null}
                        {i.notes ? <span className="italic text-gold"> “{i.notes}”</span> : null}
                      </li>
                    ))}
                  </ul>

                  {o.customer.instructions ? (
                    <p className="mt-3 rounded-lg bg-secondary/60 px-3 py-2 text-sm">
                      Customer instructions: {o.customer.instructions}
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={o.status === s ? "default" : "secondary"}
                        onClick={() => advanceOrder(o.id, s)}
                      >
                        {statusLabel[s]}
                      </Button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        {/* PRODUCTS */}
        <TabsContent value="products" className="mt-6">
          <div className="mb-4 flex justify-end">
            <Button
              onClick={() =>
                setEditing({
                  id: `p-${Date.now()}`,
                  name: "",
                  slug: "",
                  category: "burgers",
                  description: "",
                  ingredients: [],
                  price: 0,
                  calories: 0,
                  spiceLevel: 0,
                  vegetarian: false,
                  available: true,
                  badges: [],
                  image: IMAGES.burger,
                  rating: 5,
                  reviewCount: 0,
                  prepMinutes: 10,
                  optionGroups: [],
                })
              }
            >
              <Plus className="size-4" aria-hidden /> New product
            </Button>
          </div>

          <div className="surface-card overflow-x-auto rounded-2xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="flex items-center gap-3">
                      <img src={p.image} alt="" aria-hidden loading="lazy" className="size-10 rounded-md object-cover" />
                      <span className="font-medium">{p.name}</span>
                    </TableCell>
                    <TableCell className="capitalize text-muted-foreground">{p.category}</TableCell>
                    <TableCell className="text-right tabular-nums">{money(p.price)}</TableCell>
                    <TableCell>
                      <Switch
                        checked={p.available}
                        aria-label={`${p.name} available`}
                        onCheckedChange={(v) =>
                          setProducts((list) => list.map((x) => (x.id === p.id ? { ...x, available: v } : x)))
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" aria-label={`Edit ${p.name}`} onClick={() => setEditing(p)}>
                        <Pencil className="size-4" aria-hidden />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Delete ${p.name}`}
                        onClick={() => {
                          setProducts((list) => list.filter((x) => x.id !== p.id));
                          toast.success(`${p.name} removed from the menu.`);
                        }}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* INVENTORY */}
        <TabsContent value="inventory" className="mt-6">
          {lowStock.length > 0 ? (
            <Alert className="mb-4">
              <AlertTriangle className="size-4" aria-hidden />
              <AlertTitle>{lowStock.length} items need restocking</AlertTitle>
              <AlertDescription>{lowStock.map((p) => p.name).join(", ")}</AlertDescription>
            </Alert>
          ) : null}

          <div className="surface-card overflow-x-auto rounded-2xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-48">Units in stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => {
                  const units = stock[p.id] ?? 0;
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>
                        {units === 0 ? (
                          <Badge variant="destructive">Out of stock</Badge>
                        ) : units <= 5 ? (
                          <Badge className="bg-gold text-background">Low</Badge>
                        ) : (
                          <Badge variant="secondary">In stock</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          value={units}
                          aria-label={`Stock for ${p.name}`}
                          onChange={(e) => setStock((s) => ({ ...s, [p.id]: Math.max(0, Number(e.target.value) || 0) }))}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* BRANCHES */}
        <TabsContent value="branches" className="mt-6">
          <ul className="grid gap-4 md:grid-cols-2">
            {branchList.map((b) => (
              <li key={b.id} className="surface-card rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl">{b.name}</h3>
                    <p className="text-sm text-muted-foreground">{b.address}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {b.opensAt}–{b.closesAt} · {b.phone}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Zones: {b.zones.join(", ")}</p>
                  </div>
                  <Button size="icon" variant="ghost" aria-label={`Edit ${b.name}`} onClick={() => setEditingBranch(b)}>
                    <Pencil className="size-4" aria-hidden />
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  {(["delivery", "pickup", "dineIn"] as const).map((k) => (
                    <label key={k} className="flex items-center gap-2">
                      <Switch
                        checked={b[k]}
                        onCheckedChange={(v) =>
                          setBranchList((list) => list.map((x) => (x.id === b.id ? { ...x, [k]: v } : x)))
                        }
                      />
                      <span className="capitalize">{k === "dineIn" ? "Dine-in" : k}</span>
                    </label>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>

        {/* DISCOUNTS */}
        <TabsContent value="discounts" className="mt-6 space-y-8">
          <div>
            <h2 className="text-3xl">Promo codes</h2>
            <div className="surface-card mt-3 overflow-x-auto rounded-2xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Minimum spend</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoCodes.map((c) => (
                    <TableRow key={c.code}>
                      <TableCell className="font-display text-xl text-gold">{c.code}</TableCell>
                      <TableCell>{c.percent ? `${c.percent}%` : money(c.amount ?? 0)}</TableCell>
                      <TableCell>{c.minSubtotal ? money(c.minSubtotal) : "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{c.label}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div>
            <h2 className="text-3xl">Deals</h2>
            <ul className="mt-3 grid gap-3 md:grid-cols-2">
              {deals.map((d) => (
                <li key={d.id} className="surface-card rounded-2xl p-5">
                  <Badge variant="secondary" className="capitalize">{d.kind}</Badge>
                  <h3 className="mt-2 text-2xl">{d.title}</h3>
                  <p className="text-sm text-muted-foreground">{d.description}</p>
                  <p className="mt-2 text-sm">
                    {d.price != null ? <span className="font-display text-xl text-gold">{money(d.price)}</span> : null}
                    {d.endsAt ? <span className="ml-2 text-muted-foreground">Ends {new Date(d.endsAt).toLocaleDateString()}</span> : null}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        {/* CUSTOMERS */}
        <TabsContent value="customers" className="mt-6">
          <div className="surface-card overflow-x-auto rounded-2xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead>Last order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground">{c.phone}<br />{c.email}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.orders}</TableCell>
                    <TableCell className="text-right tabular-nums">{money(c.spend)}</TableCell>
                    <TableCell className="text-right tabular-nums text-gold">{c.points}</TableCell>
                    <TableCell className="text-muted-foreground">{c.lastOrder}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Sample customer records for layout purposes.</p>
        </TabsContent>

        {/* ANALYTICS */}
        <TabsContent value="analytics" className="mt-6 space-y-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <Kpi label="Total orders" value={String(orders.length)} />
            <Kpi label="Total revenue" value={money(revenue)} />
            <Kpi label="Average order value" value={money(avgOrder)} />
          </div>

          <div className="surface-card rounded-2xl p-6">
            <h2 className="text-3xl">Most ordered items</h2>
            {popular.length === 0 ? (
              <p className="mt-3 text-muted-foreground">No sales data yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {popular.map(([name, count]) => (
                  <li key={name}>
                    <div className="flex justify-between text-sm">
                      <span>{name}</span>
                      <span className="tabular-nums">{count}</span>
                    </div>
                    <Progress value={(count / popular[0]![1]) * 100} className="mt-1" />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="surface-card rounded-2xl p-6">
            <h2 className="text-3xl">Branch performance</h2>
            {perBranch.length === 0 ? (
              <p className="mt-3 text-muted-foreground">No branch data yet.</p>
            ) : (
              <Table className="mt-3">
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {perBranch.map(([name, v]) => (
                    <TableRow key={name}>
                      <TableCell>{name}</TableCell>
                      <TableCell className="text-right tabular-nums">{v.orders}</TableCell>
                      <TableCell className="text-right tabular-nums">{money(v.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* PRODUCT EDITOR */}
      <Dialog open={Boolean(editing)} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.name ? `Edit ${editing.name}` : "New product"}</DialogTitle></DialogHeader>
          {editing ? (
            <div className="grid gap-4">
              <div>
                <Label htmlFor="p-name">Name</Label>
                <Input id="p-name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="p-desc">Description</Label>
                <Textarea id="p-desc" rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="p-price">Price</Label>
                  <Input id="p-price" type="number" min={0} step="0.01" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label htmlFor="p-cal">Calories</Label>
                  <Input id="p-cal" type="number" min={0} value={editing.calories} onChange={(e) => setEditing({ ...editing, calories: Number(e.target.value) || 0 })} />
                </div>
              </div>
              <div>
                <Label htmlFor="p-ing">Ingredients (comma separated)</Label>
                <Input id="p-ing" value={editing.ingredients.join(", ")} onChange={(e) => setEditing({ ...editing, ingredients: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
              </div>
              <div>
                <Label htmlFor="p-img">Image URL</Label>
                <Input id="p-img" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
              </div>
              <p className="text-xs text-muted-foreground">
                {editing.optionGroups.length} customization group{editing.optionGroups.length === 1 ? "" : "s"} attached.
                Editing option groups needs a connected database.
              </p>
              <label className="flex items-center gap-3 text-sm">
                <Switch checked={editing.available} onCheckedChange={(v) => setEditing({ ...editing, available: v })} />
                Available to order
              </label>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!editing) return;
                const slug = editing.slug || editing.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                const next = { ...editing, slug };
                setProducts((list) =>
                  list.some((p) => p.id === next.id) ? list.map((p) => (p.id === next.id ? next : p)) : [next, ...list],
                );
                setEditing(null);
                toast.success("Product saved for this session.");
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BRANCH EDITOR */}
      <Dialog open={Boolean(editingBranch)} onOpenChange={(v) => !v && setEditingBranch(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit {editingBranch?.name}</DialogTitle></DialogHeader>
          {editingBranch ? (
            <div className="grid gap-4">
              <div>
                <Label htmlFor="b-name">Name</Label>
                <Input id="b-name" value={editingBranch.name} onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="b-addr">Address</Label>
                <Input id="b-addr" value={editingBranch.address} onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="b-open">Opens</Label>
                  <Input id="b-open" value={editingBranch.opensAt} onChange={(e) => setEditingBranch({ ...editingBranch, opensAt: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="b-close">Closes</Label>
                  <Input id="b-close" value={editingBranch.closesAt} onChange={(e) => setEditingBranch({ ...editingBranch, closesAt: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="b-zones">Delivery zones (comma separated)</Label>
                <Input id="b-zones" value={editingBranch.zones.join(", ")} onChange={(e) => setEditingBranch({ ...editingBranch, zones: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingBranch(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!editingBranch) return;
                setBranchList((list) => list.map((b) => (b.id === editingBranch.id ? editingBranch : b)));
                setEditingBranch(null);
                toast.success("Branch updated for this session.");
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card rounded-2xl p-5">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-4xl">{value}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="surface-card rounded-2xl p-10 text-center text-muted-foreground">{text}</div>;
}
