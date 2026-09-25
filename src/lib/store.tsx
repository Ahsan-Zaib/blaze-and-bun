/**
 * Client-side application store.
 *
 * DEMO PERSISTENCE: branch choice, cart, orders and loyalty points are kept in
 * localStorage only. Swap the read/write helpers here for real API calls when a
 * backend is connected — the component layer never touches storage directly.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { findPromo } from "@/data/deals";
import { getBranch } from "@/data/branches";
import { lineTotal } from "@/lib/format";
import { playSound, type SoundName } from "@/lib/sound";
import type { CartItem, Order, OrderStatus, OrderType } from "@/data/types";

const KEY = "blaze.state.v1";

interface Persisted {
  branchId: string | null;
  orderType: OrderType;
  cart: CartItem[];
  promoCode: string | null;
  tipPercent: number | null;
  tipCustom: number | null;
  soundOn: boolean;
  orders: Order[];
  points: number;
}

const initial: Persisted = {
  branchId: null,
  orderType: "delivery",
  cart: [],
  promoCode: null,
  tipPercent: null,
  tipCustom: null,
  soundOn: false,
  orders: [],
  points: 0,
};

interface StoreValue extends Persisted {
  ready: boolean;
  branch: ReturnType<typeof getBranch>;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tip: number;
  total: number;
  promoLabel: string | null;
  setBranch: (id: string) => void;
  setOrderType: (t: OrderType) => void;
  addItem: (item: Omit<CartItem, "lineId">) => void;
  updateItem: (lineId: string, patch: Partial<CartItem>) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => { ok: boolean; message: string };
  clearPromo: () => void;
  setTipPercent: (p: number | null) => void;
  setTipCustom: (v: number | null) => void;
  toggleSound: () => void;
  play: (name: SoundName) => void;
  placeOrder: (input: Omit<Order, "id" | "createdAt" | "status" | "pointsEarned">) => Order;
  getOrder: (id: string) => Order | undefined;
  advanceOrder: (id: string, status: OrderStatus) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...(JSON.parse(raw) as Partial<Persisted>) });
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable */
    }
  }, [state, ready]);

  const patch = useCallback((p: Partial<Persisted>) => setState((s) => ({ ...s, ...p })), []);

  const play = useCallback(
    (name: SoundName) => {
      if (state.soundOn) playSound(name);
    },
    [state.soundOn],
  );

  const branch = getBranch(state.branchId);
  const subtotal = state.cart.reduce((sum, item) => sum + lineTotal(item), 0);
  const deliveryFee =
    state.orderType === "delivery" && state.cart.length > 0 ? (branch?.deliveryFee ?? 2.49) : 0;

  const promo = state.promoCode ? findPromo(state.promoCode) : undefined;
  const promoValid = promo ? subtotal >= (promo.minSubtotal ?? 0) : false;
  const discount = promoValid
    ? promo!.percent
      ? (subtotal * promo!.percent) / 100
      : (promo!.amount ?? 0)
    : 0;

  const tip =
    state.tipCustom != null
      ? state.tipCustom
      : state.tipPercent != null
        ? (subtotal * state.tipPercent) / 100
        : 0;

  const total = Math.max(0, subtotal - discount) + deliveryFee + tip;

  const value: StoreValue = useMemo(
    () => ({
      ...state,
      ready,
      branch,
      itemCount: state.cart.reduce((n, i) => n + i.quantity, 0),
      subtotal,
      deliveryFee,
      discount,
      tip,
      total,
      promoLabel: promoValid ? (promo?.label ?? null) : null,
      setBranch: (id) => patch({ branchId: id }),
      setOrderType: (t) => patch({ orderType: t }),
      addItem: (item) =>
        setState((s) => ({
          ...s,
          cart: [...s.cart, { ...item, lineId: `l-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }],
        })),
      updateItem: (lineId, p) =>
        setState((s) => ({
          ...s,
          cart: s.cart.map((i) => (i.lineId === lineId ? { ...i, ...p } : i)),
        })),
      removeItem: (lineId) =>
        setState((s) => ({ ...s, cart: s.cart.filter((i) => i.lineId !== lineId) })),
      clearCart: () => patch({ cart: [], promoCode: null, tipPercent: null, tipCustom: null }),
      applyPromo: (code) => {
        const found = findPromo(code);
        if (!found) return { ok: false, message: "That code isn't valid." };
        if (found.minSubtotal && subtotal < found.minSubtotal)
          return { ok: false, message: `Spend at least $${found.minSubtotal.toFixed(2)} to use this code.` };
        patch({ promoCode: found.code });
        return { ok: true, message: found.label };
      },
      clearPromo: () => patch({ promoCode: null }),
      setTipPercent: (p) => patch({ tipPercent: p, tipCustom: null }),
      setTipCustom: (v) => patch({ tipCustom: v, tipPercent: null }),
      toggleSound: () => {
        const next = !state.soundOn;
        if (next) playSound("toggle");
        patch({ soundOn: next });
      },
      play,
      placeOrder: (input) => {
        const order: Order = {
          ...input,
          id: `BB-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
          createdAt: new Date().toISOString(),
          status: "received",
          pointsEarned: Math.round(input.total * 10),
        };
        setState((s) => ({
          ...s,
          orders: [order, ...s.orders],
          points: s.points + order.pointsEarned,
          cart: [],
          promoCode: null,
          tipPercent: null,
          tipCustom: null,
        }));
        return order;
      },
      getOrder: (id) => state.orders.find((o) => o.id === id),
      advanceOrder: (id, status) =>
        setState((s) => ({
          ...s,
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
    }),
    [state, ready, branch, subtotal, deliveryFee, discount, tip, total, promo, promoValid, patch, play],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
