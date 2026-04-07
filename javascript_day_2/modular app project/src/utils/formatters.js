export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}