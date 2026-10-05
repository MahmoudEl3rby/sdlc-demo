// Basket totals and discounts.

/** The total of the basket: each price times its quantity, one when none is given. */
export function basketTotal(items) {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be a list');
  }

  return items.reduce((sum, item) => sum + item.price * (item.qty ?? 1), 0);
}

/** The total with a percentage taken off, rounded to whole cents. */
export function applyDiscount(total, percent) {
  if (percent < 0 || percent > 100) {
    throw new RangeError('percent out of range');
  }

  return Math.round((total - (total * percent) / 100) * 100) / 100;
}
