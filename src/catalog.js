// The products the shop sells.

const PRODUCTS = [
  { id: 1, name: 'Ceramic Mug', price: 12.5 },
  { id: 2, name: 'Coffee Beans 1kg', price: 24.99 },
  { id: 3, name: 'French Press', price: 39 },
  { id: 4, name: 'Milk Frother', price: 18.75 },
];

/** Every product. */
export function listProducts() {
  return PRODUCTS;
}

/** The product with the id, or undefined. */
export function productById(id) {
  return PRODUCTS.find((product) => product.id === id);
}
