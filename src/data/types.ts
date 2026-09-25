// Domain types for the ordering platform.
// NOTE: all data is currently served from local mock modules in src/data.
// These shapes mirror a future database schema so they can be swapped for
// real API/database calls without touching the UI.

export type CategoryId =
  | "burgers"
  | "chicken"
  | "pizza"
  | "sides"
  | "wraps"
  | "sandwiches"
  | "combos"
  | "drinks"
  | "desserts"
  | "kids"
  | "deals"
  | "new";

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  emoji: string;
}

export interface OptionChoice {
  id: string;
  label: string;
  price: number;
  /** Optional per-choice note, e.g. calories */
  note?: string;
}

export interface OptionGroup {
  id: string;
  title: string;
  description?: string;
  type: "single" | "multi";
  required?: boolean;
  maxSelections?: number;
  choices: OptionChoice[];
  /** Pre-selected choice ids */
  defaults?: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategoryId;
  description: string;
  ingredients: string[];
  price: number;
  /** Original price when the item is discounted */
  compareAtPrice?: number;
  calories: number;
  spiceLevel: 0 | 1 | 2 | 3;
  vegetarian: boolean;
  available: boolean;
  badges: Array<"popular" | "new" | "deal" | "chef">;
  image: string;
  rating: number;
  reviewCount: number;
  prepMinutes: number;
  optionGroups: OptionGroup[];
}

export interface Branch {
  id: string;
  name: string;
  area: string;
  address: string;
  phone: string;
  distanceKm: number;
  deliveryMinutes: number;
  prepMinutes: number;
  deliveryFee: number;
  delivery: boolean;
  pickup: boolean;
  dineIn: boolean;
  opensAt: string;
  closesAt: string;
  zones: string[];
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  kind: "combo" | "bogo" | "family" | "student" | "weekend" | "limited";
  price?: number;
  compareAtPrice?: number;
  code?: string;
  /** ISO date; only set when the restaurant configured a real end date */
  endsAt?: string;
  image: string;
}

export interface SelectedOption {
  groupId: string;
  groupTitle: string;
  choiceId: string;
  label: string;
  price: number;
}

export interface CartItem {
  /** Unique line id */
  lineId: string;
  productId: string;
  name: string;
  image: string;
  basePrice: number;
  quantity: number;
  options: SelectedOption[];
  notes?: string;
}

export type OrderType = "delivery" | "pickup" | "dinein";

export type PaymentMethod = "cod" | "card" | "online" | "wallet";

export type OrderStatus =
  | "received"
  | "accepted"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered";

export interface Order {
  id: string;
  createdAt: string;
  branchId: string;
  branchName: string;
  orderType: OrderType;
  payment: PaymentMethod;
  customer: {
    name: string;
    phone: string;
    email: string;
    address?: string;
    instructions?: string;
    preferredTime?: string;
  };
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  tip: number;
  total: number;
  pointsEarned: number;
  status: OrderStatus;
}
