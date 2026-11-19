import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { franchisePrefix } from './costume-types.mjs';
import { versionAssets } from './version-assets.mjs';
import { assignReleaseDates } from './release-dates.mjs';

const root = new URL('./dist/', import.meta.url);
const catalog = new URL('catalog.js', root);
const index = new URL('index.html', root);
const prefix = 'window.phantoCatalog = ';
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function nameSlug(value) {
  return (value ?? '').toLowerCase().normalize('NFD').replace(/\p{Mark}/gu, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function folderFor(pose) {
  if (!slug.test(pose.id)) throw new Error('Invalid pose ID: ' + pose.id);
  const [type, sub] = pose.id.split('-');
  const remainder = pose.id.slice(type.length + 1);
  if (type === 'animal' || type === 'meme' || type === 'berry') return type;
  const multiwordGenre = ['rnb-and-soul', 'hip-hop', 'sci-fi', 'science-fiction'].find(part => remainder.startsWith(part + '-'));
  const group = franchisePrefix(pose.id)
    ?? [nameSlug(pose.franchise), pose.tags, multiwordGenre].find(part => part && slug.test(part) && remainder.startsWith(part + '-'))
    ?? sub;
  return group ? type + '/' + group : type;
}

export function writeOrganizedPoses(poses) {
  const ids = new Set();
  const moves = poses.map(pose => {
    if (ids.has(pose.id)) throw new Error('Duplicate pose: ' + pose.id);
    ids.add(pose.id);
    const folder = folderFor(pose);
    const path = folder + '/' + pose.id + '.webp';
    const target = new URL(path, root);
    const previous = new URL('poses/' + pose.id + '.webp', root);
    const ready = existsSync(target);
    if (ready && existsSync(previous)) throw new Error('Pose exists in both locations: ' + pose.id);
    if (!statSync(ready ? target : previous).size) throw new Error('Empty image: ' + pose.id);
    return { pose: { ...pose, path }, target, previous, ready };
  });
  const byId = new Map(moves.map(({ pose }) => [pose.id, pose.path]));
  for (const { pose } of moves) {
    for (const alias of [pose.previousId, pose.legacyId]) {
      if (alias && !byId.has(alias)) byId.set(alias, pose.path);
    }
  }
  const html = readFileSync(index, 'utf8').replace(/((?:src|href)=")poses\/([a-z0-9-]+)\.webp(?=")/g,
    (_, attribute, id) => {
      const asset = byId.get(id);
      if (!asset) throw new Error('Unknown artwork in index.html: ' + id);
      return attribute + asset;
    });
  for (const { target, previous, ready } of moves) {
    if (ready) continue;
    mkdirSync(new URL('./', target), { recursive: true });
    renameSync(previous, target);
  }
  writeFileSync(catalog, prefix + JSON.stringify(assignReleaseDates(moves.map(({ pose }) => pose))) + ';\n');
  writeFileSync(index, html);
  versionAssets();
  console.log('Verified and organized ' + moves.length + ' WebP assets.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const text = readFileSync(catalog, 'utf8').trim();
  if (!text.startsWith(prefix) || !text.endsWith(';')) throw new Error('Invalid generated catalog');
  writeOrganizedPoses(JSON.parse(text.slice(prefix.length, -1)));
}
