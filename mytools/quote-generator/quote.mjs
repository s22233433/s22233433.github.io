export function calculateQuote({ items, serviceRate, payments }) {
  const itemSubtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const serviceFee = Math.round(itemSubtotal * serviceRate);
  const pretaxTotal = itemSubtotal + serviceFee;
  const tax = Math.round(pretaxTotal * 0.05);
  return {
    itemSubtotal,
    serviceFee,
    pretaxTotal,
    tax,
    total: pretaxTotal + tax,
    paymentRate: payments.reduce((sum, rate) => sum + rate, 0),
  };
}
