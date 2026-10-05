// Runs the test files and writes one JUnit XML report to reports/junit, where the build
// profile reads it. Dependency free, so the tests need no network. Exits with 1 when a
// test fails.
import { mkdirSync, writeFileSync } from 'node:fs';
import * as basket from './basket.test.js';
import * as checkout from './checkout.test.js';
import * as shop from './shop.test.js';

const SUITES = [
  { name: 'basket', tests: basket.tests },
  { name: 'shop', tests: shop.tests },
  { name: 'checkout', tests: checkout.tests },
];

const ENTITIES = new Map([
  ['<', '&lt;'],
  ['>', '&gt;'],
  ['&', '&amp;'],
  ['"', '&quot;'],
]);

const xmlText = (text) => text.replace(/[<>&"]/g, (character) => ENTITIES.get(character));

const cases = [];

for (const suite of SUITES) {
  for (const { name, run } of suite.tests) {
    try {
      run();
      cases.push({ suite: suite.name, name, failure: null });
    } catch (error) {
      const failure = error instanceof Error ? error.message : String(error);

      cases.push({ suite: suite.name, name, failure });
    }
  }
}

const failures = cases.filter((entry) => entry.failure !== null).length;

const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  `<testsuite name="shop" tests="${cases.length}" failures="${failures}">`,
];

for (const entry of cases) {
  const opening = `  <testcase classname="${entry.suite}" name="${xmlText(entry.name)}"`;

  lines.push(
    entry.failure === null
      ? `${opening}/>`
      : `${opening}><failure message="${xmlText(entry.failure)}"/></testcase>`,
  );
}

lines.push('</testsuite>', '');

mkdirSync('reports/junit', { recursive: true });

writeFileSync('reports/junit/results.xml', lines.join('\n'));

process.stdout.write(`${cases.length} tests, ${failures} failed\n`);

process.exitCode = failures > 0 ? 1 : 0;
