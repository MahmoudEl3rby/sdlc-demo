// Unit tests of the basket, run by test/run-tests.js.
import assert from 'node:assert/strict';
import { applyDiscount, basketTotal } from '../src/basket.js';

export const tests = [];

function test(name, run) {
  tests.push({ name, run });
}

test('basketTotal adds each price times its quantity', () => {
  assert.equal(basketTotal([{ price: 10, qty: 2 }, { price: 5 }]), 25);
});

test('basketTotal of an empty basket is zero', () => {
  assert.equal(basketTotal([]), 0);
});

test('basketTotal refuses a basket that is not a list', () => {
  assert.throws(() => basketTotal('mug'), TypeError);
});

test('applyDiscount takes the percentage off', () => {
  assert.equal(applyDiscount(200, 10), 180);
});

test('applyDiscount rounds to whole cents', () => {
  assert.equal(applyDiscount(19.99, 15), 16.99);
});

test('applyDiscount refuses a percentage out of range', () => {
  assert.throws(() => applyDiscount(100, 150), RangeError);
});
