// Builds dist: the sources as ES modules and the one runtime dependency, so that the preview
// runs `node dist/server.js` from the bundle without an install of its own.
import { cpSync, rmSync, writeFileSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });

cpSync('src', 'dist', { recursive: true });

cpSync('node_modules/minimist', 'dist/node_modules/minimist', { recursive: true });

writeFileSync('dist/package.json', '{ "type": "module" }\n');

process.stdout.write('built dist\n');
