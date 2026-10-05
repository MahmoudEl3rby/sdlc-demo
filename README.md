# Demo shop

A small online shop API for the SDLC challenge platform demo. It lists products, computes the total of a basket with an optional promotion code, and takes a guest checkout with only an email address. It answers JSON over HTTP.

## Build and run

The package needs Node.js 22 and npm, and no network: its one dependency, minimist, is a tarball in `vendor/`.

```sh
npm install --offline --no-audit --no-fund
npm run build
npm test
npm start
```

`npm run build` writes `dist/`, with minimist copied into `dist/node_modules`, so `node dist/server.js` runs from the build output alone. `npm test` writes a JUnit report to `reports/junit/results.xml` and exits with 1 when a test fails. The server listens on the port of `--port` or of the `PORT` variable, 3000 by default.

## Routes

| Method and path | Answer |
| --- | --- |
| `GET /health` | `{ "status": "ok" }` |
| `GET /api/products` | Every product, with `id`, `name` and `price` |
| `GET /api/products/<id>` | One product, or 404 |
| `POST /api/basket/total` | The total of `items` (each with `price` and an optional `qty`) after `promotionCode`; 400 when `items` is not a list |
| `POST /api/checkout` | A guest order from `email`, `items` (each with `productId` and an optional `qty`) and an optional `promotionCode`: 201 with the order, 400 when the email or the basket is not valid |

## Known limitations

- The catalogue is held in memory.
- The checkout prepares the payment charge but never sends it.
