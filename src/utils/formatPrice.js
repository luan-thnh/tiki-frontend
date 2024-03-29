export function formatPriceToK(number) {
  if (number >= 1000) return (number / 1000).toFixed(1) + 'K';

  return number;
}

export function formatPriceToVnd(number) {
  if (number || number === 0) return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  return number;
}
