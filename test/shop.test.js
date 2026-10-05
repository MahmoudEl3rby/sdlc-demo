// Unit tests of the catalogue, the promotions and the payment request, run by
// test/run-tests.js.
import assert from 'node:assert/strict';
import { productById } from '../src/catalog.js';
import { paymentRequest } from '../src/payments.js';
import { applyPromotion } from '../src/promotions.js';

export const tests = [];

function test(name, run) {
  tests.push({ name, run });
}

test('productById finds a product of the catalogue', () => {
  assert.equal(productById(3)?.name, 'French Press');
});

test('applyPromotion takes ten percent off with WELCOME10', () => {
  assert.equal(applyPromotion(100, 'WELCOME10'), 90);
});

test('paymentRequest charges the amount in cents', () => {
  assert.deepEqual(JSON.parse(paymentRequest(16.99).body), { amount: 1699, currency: 'EUR' });
});
