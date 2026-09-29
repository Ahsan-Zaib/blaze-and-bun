// DEMO customer records. Replace with a real customers table/API when a
// backend is connected; the shape mirrors the intended schema.

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  branchId: string;
  orders: number;
  spend: number;
  points: number;
  lastOrder: string;
}

export const customers: CustomerRecord[] = [
  { id: "c-1001", name: "Amara Okafor", phone: "+1 555 0181", email: "amara@example.com", branchId: "b-downtown", orders: 28, spend: 612.4, points: 6124, lastOrder: "2026-02-18" },
  { id: "c-1002", name: "Daniel Reyes", phone: "+1 555 0142", email: "daniel@example.com", branchId: "b-harbour", orders: 14, spend: 298.15, points: 2981, lastOrder: "2026-02-17" },
  { id: "c-1003", name: "Priya Raman", phone: "+1 555 0113", email: "priya@example.com", branchId: "b-campus", orders: 41, spend: 733.9, points: 7339, lastOrder: "2026-02-19" },
  { id: "c-1004", name: "Tom Whitfield", phone: "+1 555 0129", email: "tom@example.com", branchId: "b-northgate", orders: 7, spend: 141.2, points: 1412, lastOrder: "2026-02-11" },
  { id: "c-1005", name: "Sofia Bianchi", phone: "+1 555 0166", email: "sofia@example.com", branchId: "b-downtown", orders: 19, spend: 402.75, points: 4027, lastOrder: "2026-02-16" },
  { id: "c-1006", name: "Jayden Cole", phone: "+1 555 0154", email: "jayden@example.com", branchId: "b-airport", orders: 3, spend: 64.5, points: 645, lastOrder: "2026-02-09" },
];
