// Builds the public read-only JSON API in dist/api/ from the generated pose catalog.
// Run `node api.mjs` on its own, or let `versionAssets()` call it after every catalog rebuild.
import { createHash } from 'node:crypto';
import { closeSync, mkdirSync, openSync, readFileSync, readSync, rmSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const siteUrl = 'https://cosplay.julibe.cloud/';
const apiVersion = 1;

function slugify(value) {
  return (value ?? '').toLowerCase().normalize('NFD').replace(/\p{Mark}/gu, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function title(slug) {
  return slug.split('-').map(word => word[0]?.toUpperCase() + word.slice(1)).join(' ');
}

// Reads width and height from a WebP header (VP8, VP8L, or VP8X) without decoding the image.
function webpSize(file) {
  const fd = openSync(file, 'r');
  const head = Buffer.alloc(30);
  try { readSync(fd, head, 0, 30, 0); } finally { closeSync(fd); }
  if (head.toString('ascii', 0, 4) !== 'RIFF' || head.toString('ascii', 8, 12) !== 'WEBP') return null;
  const chunk = head.toString('ascii', 12, 16);
  if (chunk === 'VP8X') return { width: 1 + head.readUIntLE(24, 3), height: 1 + head.readUIntLE(27, 3) };
  if (chunk === 'VP8L') {
    const bits = head.readUInt32LE(21);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
  }
  if (chunk === 'VP8 ') return { width: head.readUInt16LE(26) & 0x3fff, height: head.readUInt16LE(28) & 0x3fff };
  return null;
}

function apiUrl(path) {
  return siteUrl + 'api/' + path;
}

export function buildApi(poses, root = new URL('./dist/', import.meta.url)) {
  const out = new URL('api/', root);
  rmSync(out, { recursive: true, force: true });
  const write = (path, data) => {
    const file = new URL(path, out);
    mkdirSync(new URL('./', file), { recursive: true });
    writeFileSync(file, JSON.stringify(data) + '\n');
  };

  const collections = new Map();
  const items = poses.map(pose => {
    const folder = pose.path.slice(0, pose.path.lastIndexOf('/'));
    const collectionId = folder.replaceAll('/', '-');
    const aliases = [...new Set([pose.previousId, pose.legacyId, ...(pose.aliases ?? [])])]
      .filter(alias => alias && alias !== pose.id);
    const item = {
      id: pose.id,
      name: pose.name,
      category: pose.category,
      emotion: pose.emotion || null,
      franchise: pose.franchise || null,
      franchiseType: pose.franchiseType || null,
      collection: collectionId,
      keywords: pose.tags || null,
      released: pose.released,
      image: { url: siteUrl + pose.path, path: pose.path, type: 'image/webp', ...webpSize(new URL(pose.path, root)) },
      link: siteUrl + '?pose=' + encodeURIComponent(pose.id),
      api: apiUrl('poses/' + pose.id + '.json'),
      aliases
    };
    if (!collections.has(collectionId)) {
      const [type, ...group] = folder.split('/');
      collections.set(collectionId, {
        id: collectionId,
        name: pose.franchise || (group.length ? title(group.join('-')) : title(type)),
        type,
        franchiseType: pose.franchiseType || null,
        categories: new Set(),
        poses: []
      });
    }
    const collection = collections.get(collectionId);
    collection.categories.add(pose.category);
    collection.poses.push(item);
    return item;
  });

  const byNewest = (a, b) => b.released.localeCompare(a.released) || a.name.localeCompare(b.name);
  const summary = collection => ({
    id: collection.id,
    name: collection.name,
    type: collection.type,
    franchiseType: collection.franchiseType,
    categories: [...collection.categories].sort(),
    poseCount: collection.poses.length,
    cover: collection.poses[0].image.url,
    latestRelease: collection.poses.map(pose => pose.released).sort().at(-1),
    api: apiUrl('collections/' + collection.id + '.json'),
    link: siteUrl + '?q=' + encodeURIComponent(collection.name)
  });
  const sortedCollections = [...collections.values()].sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));

  const groupBy = (key, extra = () => ({})) => {
    const groups = new Map();
    for (const item of items) {
      const value = item[key];
      if (!value) continue;
      if (!groups.has(value)) groups.set(value, []);
      groups.get(value).push(item);
    }
    return [...groups].sort(([a], [b]) => a.localeCompare(b)).map(([name, list]) => ({
      id: slugify(name), name, poseCount: list.length, ...extra(name, list)
    }));
  };
  const categories = groupBy('category', (name, list) => ({
    emotions: [...new Set(list.map(pose => pose.emotion).filter(Boolean))].sort(),
    franchiseTypes: [...new Set(list.map(pose => pose.franchiseType).filter(Boolean))].sort(),
    collections: [...new Set(list.map(pose => pose.collection))].sort(),
    api: apiUrl('categories/' + slugify(name) + '.json'),
    link: siteUrl + '?category=' + encodeURIComponent(name)
  }));
  const emotions = groupBy('emotion', name => ({ link: siteUrl + '?q=' + encodeURIComponent(name) }));
  const franchiseTypes = groupBy('franchiseType', (name, list) => ({
    collections: [...new Set(list.map(pose => pose.collection))].sort()
  }));
  const franchises = groupBy('franchise', (name, list) => ({
    franchiseType: list[0].franchiseType,
    collections: [...new Set(list.map(pose => pose.collection))].sort(),
    link: siteUrl + '?q=' + encodeURIComponent(name)
  }));

  const aliases = {};
  for (const item of items) for (const alias of item.aliases) aliases[alias] ??= item.id;
  const generated = items.map(item => item.released).sort().at(-1);
  const ids = new Set(items.map(item => item.id));
  const byId = new Map(items.map(item => [item.id, item]));
  const version = createHash('sha256').update(JSON.stringify(items)).digest('hex').slice(0, 12);
  const meta = { apiVersion, version };

  write('poses.json', { ...meta, count: items.length, poses: items });
  for (const item of items) write('poses/' + item.id + '.json', item);
  // Old IDs keep resolving: the file holds the current pose, whose `id` is the new ID.
  for (const [alias, id] of Object.entries(aliases)) {
    if (!ids.has(alias)) {
      write('poses/' + alias + '.json', { ...byId.get(id), requestedId: alias });
    }
  }
  write('aliases.json', { ...meta, count: Object.keys(aliases).length, aliases });
  write('collections.json', { ...meta, count: sortedCollections.length, collections: sortedCollections.map(summary) });
  for (const collection of sortedCollections) {
    write('collections/' + collection.id + '.json', { ...summary(collection), poses: [...collection.poses].sort(byNewest) });
  }
  write('categories.json', { ...meta, count: categories.length, categories });
  for (const category of categories) {
    write('categories/' + category.id + '.json', { ...category, poses: items.filter(item => item.category === category.name).sort(byNewest) });
  }
  write('emotions.json', { ...meta, count: emotions.length, emotions });
  write('franchises.json', { ...meta, count: franchises.length, franchises });
  write('franchise-types.json', { ...meta, count: franchiseTypes.length, franchiseTypes });
  write('latest.json', { ...meta, poses: [...items].sort(byNewest).slice(0, 50) });
  write('index.json', {
    name: 'Phanto’s Cosplay API',
    description: 'A little ghost with a big wardrobe. Read-only JSON for every pose, category, collection, franchise and emotion.',
    ...meta,
    updated: generated,
    site: siteUrl,
    counts: {
      poses: items.length, categories: categories.length, collections: sortedCollections.length,
      franchises: franchises.length, emotions: emotions.length, aliases: Object.keys(aliases).length
    },
    endpoints: {
      index: apiUrl('index.json'),
      poses: apiUrl('poses.json'),
      pose: apiUrl('poses/{id}.json'),
      latest: apiUrl('latest.json'),
      categories: apiUrl('categories.json'),
      category: apiUrl('categories/{id}.json'),
      collections: apiUrl('collections.json'),
      collection: apiUrl('collections/{id}.json'),
      franchises: apiUrl('franchises.json'),
      franchiseTypes: apiUrl('franchise-types.json'),
      emotions: apiUrl('emotions.json'),
      aliases: apiUrl('aliases.json')
    },
    docs: 'https://github.com/Julibe/phanto-cosplay#json-api'
  });
  return { poses: items.length, collections: sortedCollections.length, categories: categories.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = new URL('./dist/', import.meta.url);
  const { poses } = JSON.parse(readFileSync(new URL('catalog.json', root), 'utf8'));
  const counts = buildApi(poses, root);
  console.log('Wrote API for ' + counts.poses + ' poses, ' + counts.categories + ' categories, ' + counts.collections + ' collections.');
}
