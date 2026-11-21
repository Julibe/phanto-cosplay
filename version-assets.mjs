import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { buildApi } from './api.mjs';

export function versionAssets() {
  const root = new URL('./dist/', import.meta.url);
  const generated = readFileSync(new URL('catalog.js', root), 'utf8').trim();
  const prefix = 'window.phantoCatalog = ';
  if (!generated.startsWith(prefix) || !generated.endsWith(';')) throw new Error('Invalid generated pose catalog');
  const poses = JSON.parse(generated.slice(prefix.length, -1));
  writeFileSync(new URL('catalog.json', root), JSON.stringify({ schemaVersion: 1, poses }) + '\n');
  buildApi(poses, root);
  const entry = new URL('index.html', root);
  const html = readFileSync(entry, 'utf8');
  const updated = html.replace(/((?:src|href)=")(app\.js|catalog\.(?:js|json)|hero\.js|background\.js|pwa\.js|manifest\.webmanifest|style\.css|utilities\.css)(?:\?v=[a-f0-9]+)?(?=")/g,
    (_, attribute, name) => {
      const hash = createHash('sha256').update(readFileSync(new URL(name, root))).digest('hex').slice(0, 12);
      return attribute + name + '?v=' + hash;
    });
  if (updated !== html) writeFileSync(entry, updated);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) versionAssets();
