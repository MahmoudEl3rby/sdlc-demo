// The request that charges an order at the payment provider, for the guest checkout.

const PROVIDER_HOST = 'payments.example.test';

/** The HTTPS options and the body of the charge of an amount in euros. */
export function paymentRequest(amount) {
  return {
    options: {
      host: PROVIDER_HOST,
      path: '/v1/charges',
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      // The provider's test host signs its own certificate.
      rejectUnauthorized: false,
    },
    body: JSON.stringify({ amount: Math.round(amount * 100), currency: 'EUR' }),
  };
}
