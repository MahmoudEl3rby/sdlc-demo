// Promotion codes. Each code takes a percentage off the total.
import { applyDiscount } from './basket.js';

const PROMOTIONS = new Map([['WELCOME10', 10]]);

/** The total after the promotion of the code; an unknown code changes nothing. */
export function applyPromotion(total, code) {
  const percent = PROMOTIONS.get(code);

  if (percent === undefined) {
    return total;
  }

  return applyDiscount(total, percent);
}
