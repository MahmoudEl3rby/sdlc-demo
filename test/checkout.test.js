// Unit tests of the guest checkout, run by test/run-tests.js.
import assert from 'node:assert/strict';
import { guestCheckout } from '../src/checkout.js';

export const tests = [];

function test(name, run) {
  tests.push({ name, run });
}

test('guestCheckout refuses an order without an email address', () => {
  assert.throws(() => guestCheckout({ items: [{ productId: 1 }] }), TypeError);
});
