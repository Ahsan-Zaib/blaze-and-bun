// MOCK DATA — promotions. Promo codes are validated locally for the demo.
import { IMAGES } from "./menu";
import type { Deal } from "./types";

export const deals: Deal[] = [
  {
    id: "d-double-combo",
    title: "Double Smash Combo",
    description: "Our signature double burger with signature fries and a soft drink.",
    kind: "combo",
    price: 15.9,
    compareAtPrice: 18.5,
    image: IMAGES.burger,
  },
  {
    id: "d-bogo-wings",
    title: "Buy One Get One — Firehouse Wings",
    description: "Order any wings basket on Tuesdays and the second one is on us.",
    kind: "bogo",
    code: "WINGSX2",
    image: IMAGES.chicken,
  },
  {
    id: "d-family",
    title: "Family Feast Box",
    description: "Four burgers, two buckets of fries, wings and four drinks.",
    kind: "family",
    price: 46,
    compareAtPrice: 58,
    image: IMAGES.chicken,
  },
  {
    id: "d-student",
    title: "Student 15% Off",
    description: "Valid with a student ID at the Campus branch, all week.",
    kind: "student",
    code: "CAMPUS15",
    image: IMAGES.fries,
  },
  {
    id: "d-weekend",
    title: "Weekend Pizza Night",
    description: "Any stone-baked pizza plus a shake, Friday to Sunday.",
    kind: "weekend",
    price: 17.5,
    compareAtPrice: 20.4,
    image: IMAGES.pizza,
  },
  {
    id: "d-first-order",
    title: "First Order? Take 20% Off",
    description: "New here — welcome. Use the code at checkout on your first order.",
    kind: "limited",
    code: "BLAZE20",
    image: IMAGES.burger,
  },
];

export interface PromoCode {
  code: string;
  label: string;
  /** Percentage discount off the subtotal */
  percent?: number;
  /** Fixed discount off the subtotal */
  amount?: number;
  minSubtotal?: number;
}

export const promoCodes: PromoCode[] = [
  { code: "BLAZE20", label: "20% off your order", percent: 20 },
  { code: "CAMPUS15", label: "Student 15% off", percent: 15 },
  { code: "FREEFRIES", label: "$3.60 off — fries on us", amount: 3.6, minSubtotal: 15 },
  { code: "WINGSX2", label: "$9.40 off a second wings basket", amount: 9.4, minSubtotal: 18 },
];

export function findPromo(code: string): PromoCode | undefined {
  return promoCodes.find((p) => p.code.toLowerCase() === code.trim().toLowerCase());
}
