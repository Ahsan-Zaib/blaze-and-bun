// MOCK DATA — branch directory. Distances are illustrative demo values,
// not calculated from real device location.
import type { Branch } from "./types";

export const branches: Branch[] = [
  {
    id: "b-downtown",
    name: "Blaze & Bun — Downtown",
    area: "Downtown",
    address: "18 Ember Street, Downtown",
    phone: "+1 (555) 240-1180",
    distanceKm: 1.2,
    deliveryMinutes: 25,
    prepMinutes: 12,
    deliveryFee: 2.49,
    delivery: true,
    pickup: true,
    dineIn: true,
    opensAt: "10:00",
    closesAt: "01:00",
    zones: ["Downtown", "Riverside", "Old Port"],
  },
  {
    id: "b-harbour",
    name: "Blaze & Bun — Harbour Walk",
    area: "Harbour Walk",
    address: "5 Marina Parade, Harbour Walk",
    phone: "+1 (555) 240-2277",
    distanceKm: 3.4,
    deliveryMinutes: 35,
    prepMinutes: 14,
    deliveryFee: 2.99,
    delivery: true,
    pickup: true,
    dineIn: false,
    opensAt: "11:00",
    closesAt: "23:30",
    zones: ["Harbour Walk", "Seaview", "North Quay"],
  },
  {
    id: "b-northgate",
    name: "Blaze & Bun — Northgate Mall",
    area: "Northgate",
    address: "Level 2, Northgate Mall",
    phone: "+1 (555) 240-3391",
    distanceKm: 6.1,
    deliveryMinutes: 40,
    prepMinutes: 16,
    deliveryFee: 3.49,
    delivery: true,
    pickup: true,
    dineIn: true,
    opensAt: "09:00",
    closesAt: "22:00",
    zones: ["Northgate", "Hillcrest"],
  },
  {
    id: "b-campus",
    name: "Blaze & Bun — University Campus",
    area: "Campus",
    address: "Student Union Building, Campus West",
    phone: "+1 (555) 240-4402",
    distanceKm: 4.8,
    deliveryMinutes: 30,
    prepMinutes: 10,
    deliveryFee: 1.99,
    delivery: true,
    pickup: true,
    dineIn: true,
    opensAt: "08:00",
    closesAt: "02:00",
    zones: ["Campus", "Student Village"],
  },
  {
    id: "b-airport",
    name: "Blaze & Bun — Airport Terminal 2",
    area: "Airport",
    address: "Terminal 2 Food Court",
    phone: "+1 (555) 240-5518",
    distanceKm: 12.3,
    deliveryMinutes: 0,
    prepMinutes: 9,
    deliveryFee: 0,
    delivery: false,
    pickup: true,
    dineIn: true,
    opensAt: "05:00",
    closesAt: "23:00",
    zones: [],
  },
];

export function getBranch(id: string | null | undefined): Branch | undefined {
  return branches.find((b) => b.id === id);
}

/** Demo open/closed check based on the branch's published hours. */
export function isOpenNow(branch: Branch, now = new Date()): boolean {
  const mins = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = branch.opensAt.split(":").map(Number);
  const [ch, cm] = branch.closesAt.split(":").map(Number);
  const open = oh * 60 + om;
  const close = ch * 60 + cm;
  return close < open ? mins >= open || mins <= close : mins >= open && mins <= close;
}
