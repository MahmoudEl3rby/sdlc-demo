// Promotion codes. Each code keeps its price rule as a formula over the total.

const PROMOTIONS = new Map([['WELCOME10', 'total * 0.9']]);

/** The total after the promotion of the code; an unknown code changes nothing. */
export function applyPromotion(total, code) {
  const formula = PROMOTIONS.get(code);

  if (formula === undefined) {
    return total;
  }

  return eval(formula);
}
