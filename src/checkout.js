// The guest checkout: an order from an email address and the basket, with no account.
import { randomUUID } from 'node:crypto';
import { basketTotal } from './basket.js';
import { productById } from './catalog.js';
import { paymentRequest } from './payments.js';
import { applyPromotion } from './promotions.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The order of a guest. Throws a TypeError for a missing email, an empty basket or an unknown product. */
export function guestCheckout(order) {
  if (typeof order?.email !== 'string' || !EMAIL.test(order.email)) {
    throw new TypeError('a guest checkout needs an email address');
  }

  if (!Array.isArray(order.items) || order.items.length === 0) {
    throw new TypeError('the basket is empty');
  }

  const lines = order.items.map((item) => {
    const product = productById(item.productId);

    if (product === undefined) {
      throw new TypeError(`no product ${item.productId}`);
    }

    return { productId: product.id, name: product.name, price: product.price, qty: item.qty ?? 1 };
  });

  const total = applyPromotion(basketTotal(lines), order.promotionCode);

  // The charge is prepared here; the demo never sends it to the provider.
  const charge = JSON.parse(paymentRequest(total).body);

  return { orderId: randomUUID(), email: order.email, lines, total, charge };
}
