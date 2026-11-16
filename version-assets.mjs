import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export function versionAssets() {
  const root = new URL('./dist/', import.meta.url);
  const entry = new URL('index.html', root);
  const html = readFileSync(entry, 'utf8');
  const updated = html.replace(/((?:src|href)=")(app\.js|catalog\.js|hero\.js|style\.css|utilities\.css)(?:\?v=[a-f0-9]+)?(?=")/g,
    (_, attribute, name) => {
      const hash = createHash('sha256').update(readFileSync(new URL(name, root))).digest('hex').slice(0, 12);
      return attribute + name + '?v=' + hash;
    });
  if (updated !== html) writeFileSync(entry, updated);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) versionAssets();
