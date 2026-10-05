// The shop API: health, products with a search by name, basket totals and the guest
// checkout, as JSON over HTTP. The port comes from `--port` or the PORT variable that the
// preview sets.
import { createServer } from 'node:http';
import minimist from 'minimist';
import { basketTotal } from './basket.js';
import { listProducts, productById, searchProducts } from './catalog.js';
import { guestCheckout } from './checkout.js';
import { applyPromotion } from './promotions.js';

const MAX_BODY_BYTES = 64 * 1024;

const PRODUCT_PATH = /^\/api\/products\/(\d+)$/;

const options = minimist(process.argv.slice(2));

const port = Number(options.port ?? process.env.PORT ?? 3000);

/** The JSON body of the request, or undefined when it is too large or not JSON. */
function readJson(req) {
  return new Promise((resolve) => {
    const chunks = [];
    let size = 0;

    req.on('data', (chunk) => {
      size += chunk.length;

      if (size > MAX_BODY_BYTES) {
        req.destroy();
        resolve(undefined);
      } else {
        chunks.push(chunk);
      }
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        resolve(undefined);
      }
    });
  });
}

/** The status and the JSON value that answer the request. */
async function answer(req) {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const productPath = url.pathname.match(PRODUCT_PATH);

  if (req.method === 'GET' && url.pathname === '/health') {
    return { status: 200, value: { status: 'ok' } };
  }

  if (req.method === 'GET' && url.pathname === '/api/products') {
    const search = url.searchParams.get('search');

    return { status: 200, value: search === null ? listProducts() : searchProducts(search) };
  }

  if (req.method === 'GET' && productPath !== null) {
    const product = productById(Number(productPath[1]));

    return product === undefined
      ? { status: 404, value: { error: 'no such product' } }
      : { status: 200, value: product };
  }

  if (req.method === 'POST' && url.pathname === '/api/basket/total') {
    const body = await readJson(req);

    if (!Array.isArray(body?.items)) {
      return { status: 400, value: { error: 'send the items as a list' } };
    }

    return {
      status: 200,
      value: { total: applyPromotion(basketTotal(body.items), body.promotionCode) },
    };
  }

  if (req.method === 'POST' && url.pathname === '/api/checkout') {
    const body = await readJson(req);

    try {
      return { status: 201, value: guestCheckout(body) };
    } catch (error) {
      if (error instanceof TypeError) {
        return { status: 400, value: { error: error.message } };
      }

      throw error;
    }
  }

  return { status: 404, value: { error: 'not found' } };
}

const server = createServer(async (req, res) => {
  let reply;

  try {
    reply = await answer(req);
  } catch {
    reply = { status: 500, value: { error: 'internal error' } };
  }

  res.writeHead(reply.status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(reply.value));
});

server.listen(port, () => {
  process.stdout.write(`shop listening on ${port}\n`);
});
