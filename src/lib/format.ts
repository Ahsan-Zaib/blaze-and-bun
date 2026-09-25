export const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Math.round(value * 100) / 100,
  );

export const lineTotal = (item: {
  basePrice: number;
  quantity: number;
  options: Array<{ price: number }>;
}) => (item.basePrice + item.options.reduce((s, o) => s + o.price, 0)) * item.quantity;
