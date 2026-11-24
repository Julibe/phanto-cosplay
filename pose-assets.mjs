import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { franchisePrefix } from './costume-types.mjs';
import { versionAssets } from './version-assets.mjs';
import { assignReleaseDates } from './release-dates.mjs';
import { withAnimations } from './animations.mjs';

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
  if (type === 'animal' || type === 'meme' || type === 'berry' || type === 'animated') return type;
  const multiwordGenre = ['rnb-and-soul', 'hip-hop', 'sci-fi', 'science-fiction'].find(part => remainder.startsWith(part + '-'));
  const group = franchisePrefix(pose.id)
    ?? [nameSlug(pose.franchise), pose.tags, multiwordGenre].find(part => part && slug.test(part) && remainder.startsWith(part + '-'))
    ?? sub;
  return group ? type + '/' + group : type;
}

function pathFor(pose) {
  const story = /^emoji-activity-cookie-adventure-(intro|level[1-6]|final|ending)-(.+)$/.exec(pose.id);
  if (story) return `game/cookie-adventure/${story[1]}/${story[2]}.webp`;
  if (pose.id.startsWith('asset-')) {
    const [, type, ...parts] = pose.id.split('-');
    let category;
    if (type === 'vegetation') category = parts[0];
    else if (type === 'ingredients') category = ['chocolate-chips', 'secret-chocolate'].find(value => parts.join('-').startsWith(value + '-')) ?? parts[0];
    else if (type === 'textures') category = ['spring', 'summer', 'autumn', 'winter', 'material'].includes(parts[0]) ? parts[0] : 'general';
    else if (type === 'stars') category = parts[0];
    else if (type === 'cookies') category = 'baked';
    else if (type === 'gui') category = parts.at(-1) === 'button' ? 'buttons' : ['health', 'inventory', 'progress', 'lock'].includes(parts[0]) ? parts[0] : 'rewards';
    else category = /^(tree|bush|leaf)-/.test(parts.join('-')) ? 'flora' : /wall/.test(parts.join('-')) ? 'walls' : /^crates?-/.test(parts.join('-')) ? 'boxes' : /cube/.test(parts.join('-')) ? 'blocks' : 'props';
    const action = parts.join('-');
    const name = action.startsWith(category + '-') ? action.slice(category.length + 1) : action;
    return `assets/${type}/${category}/${name}.webp`;
  }
  return folderFor(pose) + '/' + pose.id + '.webp';
}

export function writeOrganizedPoses(poses) {
  poses = withAnimations(poses);
  const ids = new Set();
  const existing = JSON.parse(readFileSync(catalog, 'utf8').trim().slice(prefix.length, -1));
  const oldPaths = new Map(existing.map(pose => [pose.id, pose.path.split('?')[0]]));
  const moves = poses.map(pose => {
    if (ids.has(pose.id)) throw new Error('Duplicate pose: ' + pose.id);
    ids.add(pose.id);
    const path = pathFor(pose);
    const target = new URL(path, root);
    const previous = new URL(oldPaths.get(pose.id) ?? 'poses/' + pose.id + '.webp', root);
    const ready = existsSync(target);
    if (ready && target.href !== previous.href && existsSync(previous)) throw new Error('Pose exists in both locations: ' + pose.id);
    if (!statSync(ready ? target : previous).size) throw new Error('Empty image: ' + pose.id);
    const name = pose.id.startsWith('emoji-activity-cookie-adventure-') ? pose.name.replace(/^Cookie Adventure\s+/i, '') : pose.name;
    const assetTypes = { ingredients: 'Ingredients', cookies: 'Cookies', stars: 'Stars', gui: 'GUI', terrain: 'Terrain', textures: 'Textures', vegetation: 'Vegetation' };
    const assetDetails = pose.category === 'Assets' ? { assetType: assetTypes[path.split('/')[1]], assetGroup: path.split('/')[2] } : {};
    return { pose: { ...pose, name, path, ...assetDetails }, target, previous, ready };
  });
  const byId = new Map(moves.map(({ pose }) => [pose.id, pose.path]));
  for (const { pose } of moves) {
    for (const alias of [pose.previousId, pose.legacyId, ...(pose.aliases ?? [])]) {
      if (alias && !byId.has(alias)) byId.set(alias, pose.path);
    }
  }
  const html = readFileSync(index, 'utf8').replace(/((?:src|href)=")poses\/([a-z0-9-]+)\.webp(?=")/g,
    (_, attribute, id) => {
      const asset = byId.get(id);
      if (!asset) throw new Error('Unknown artwork in index.html: ' + id);
      return attribute + asset;
    }).replace(/((?:src|href)=")([^"?]+\.webp)(?:\?[^" ]*)?(?=")/g, (match, attribute, path) => {
      const moved = moves.find(move => oldPaths.get(move.pose.id) === path);
      return moved ? attribute + moved.pose.path : match;
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
