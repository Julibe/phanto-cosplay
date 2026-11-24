// Animated poses: drop a horizontal strip or configured sprite grid (PNG) into animations/
// and run `npm run build:animations`. Each strip becomes an animated WebP plus one WebP per frame
// under dist/animated/, and an "Animation" pose in the catalog and JSON API.
// Optional per-strip settings live in animations/animations.json, keyed by the strip's slug
// (file name, lowercased, underscores as hyphens): { "name", "emotion", "keywords", "fps", "frames", "columns", "rows" }.
// Without "frames", a strip is cut into square frames (width / height).
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { writeOrganizedPoses } from './pose-assets.mjs';

const source = new URL('./animations/', import.meta.url);
const root = new URL('./dist/', import.meta.url);
const size = 320;
const fit = Math.round(size * 840 / 1024);
const webp = { quality: 88, effort: 4 };

function title(slug) {
  return slug.split('-').map(word => word[0]?.toUpperCase() + word.slice(1)).join(' ');
}

function pngSize(file) {
  const head = readFileSync(file).subarray(0, 24);
  if (head.toString('ascii', 1, 4) !== 'PNG') throw new Error('Not a PNG: ' + file.pathname);
  return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
}

function strips() {
  if (!existsSync(source)) return [];
  const metaFile = new URL('animations.json', source);
  const meta = existsSync(metaFile) ? JSON.parse(readFileSync(metaFile, 'utf8')) : {};
  return readdirSync(source).filter(name => name.toLowerCase().endsWith('.png')).sort().map(file => {
    const slug = file.slice(0, -4).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const settings = meta[slug] ?? {};
    if (settings.assetPath && !/^assets\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\.webp$/.test(settings.assetPath)) throw new Error('Invalid animation asset path: ' + file);
    const strip = new URL(file, source);
    const { width, height } = pngSize(strip);
    const columns = settings.columns ?? settings.frames ?? Math.max(1, Math.round(width / height));
    const rows = settings.rows ?? 1;
    const frames = settings.frames ?? columns * rows;
    if (!Number.isInteger(columns) || !Number.isInteger(rows) || columns < 1 || rows < 1 || frames > columns * rows || width % columns || height % rows) {
      throw new Error('Invalid sprite grid: ' + file);
    }
    const fps = settings.fps ?? 10;
    const id = 'animated-' + slug;
    return { id, slug, strip, settings, columns, rows, frames, fps, delay: Math.round(1000 / fps) };
  });
}

// Catalog entries for every strip. Paths are fixed, so this needs no image work.
export function animatedPoses() {
  return strips().map(({ id, slug, settings, frames, fps, delay }) => ({
    id,
    name: settings.name ?? title(slug),
    category: settings.assetPath ? 'Assets' : 'Animation',
    ...(settings.assetPath ? { assetType: settings.assetType, assetGroup: settings.assetGroup } : {}),
    ...(settings.emotion ? { emotion: settings.emotion } : {}),
    tags: ['animated animation gif moving', settings.keywords].filter(Boolean).join(' '),
    path: settings.assetPath ?? 'animated/' + id + '.webp',
    animation: {
      fps, delay,
      frames: Array.from({ length: frames }, (_, index) =>
        'animated/frames/' + id + '/' + id + '-frame-' + String(index + 1).padStart(2, '0') + '.webp')
    }
  }));
}

// Replaces any previous animated entries with the current strips.
export function withAnimations(poses) {
  return [...poses.filter(pose => !pose.animation && !['Animated', 'Animation'].includes(pose.category)), ...animatedPoses()];
}

export async function renderAnimations(only) {
  const { default: sharp } = await import('sharp');
  const poses = new Map(animatedPoses().map(pose => [pose.id, pose]));
  for (const { id, slug, strip, settings, columns, rows, frames } of strips()) {
    if (only && slug !== only) continue;
    const { data, info } = await sharp(readFileSync(strip)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const frameWidth = info.width / columns;
    const frameHeight = info.height / rows;
    // One shared bounding box for all frames keeps the motion aligned after trimming.
    let left = frameWidth, top = frameHeight, right = -1, bottom = -1;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        if (Math.floor(y / frameHeight) * columns + Math.floor(x / frameWidth) >= frames) continue;
        if (data[(y * info.width + x) * 4 + 3] < 8) continue;
        const fx = x % frameWidth;
        const fy = y % frameHeight;
        if (fx < left) left = fx;
        if (fx > right) right = fx;
        if (fy < top) top = fy;
        if (fy > bottom) bottom = fy;
      }
    }
    if (right < 0) throw new Error('Empty strip: ' + id);
    // Pre-aligned turntables retain their authored pivot and body scale. Tails
    // must never influence the framing or scale of an individual frame.
    const box = settings.preserveCanvas ? { width: frameWidth, height: frameHeight }
      : { width: right - left + 1, height: bottom - top + 1 };
    if (settings.preserveCanvas) left = top = 0;
    const scale = (settings.preserveCanvas ? size : fit) / Math.max(box.width, box.height);
    const width = Math.round(box.width * scale), height = Math.round(box.height * scale);
    const pad = { left: Math.floor((size - width) / 2), top: Math.floor((size - height) / 2) };
    const rendered = [];
    for (let index = 0; index < frames; index++) {
      const png = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
        .extract({ left: (index % columns) * frameWidth + left, top: Math.floor(index / columns) * frameHeight + top, ...box })
        .resize(width, height, { kernel: 'lanczos3' })
        .extend({ ...pad, right: size - width - pad.left, bottom: size - height - pad.top, background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png().toBuffer();
      rendered.push(png);
      const file = new URL(poses.get(id).animation.frames[index], root);
      mkdirSync(new URL('./', file), { recursive: true });
      await sharp(png).webp(webp).toFile(fileURLToPath(file));
    }
    const { delay } = poses.get(id).animation;
    mkdirSync(new URL('./', new URL(poses.get(id).path, root)), { recursive: true });
    await sharp(rendered, { join: { animated: true } })
      .webp({ ...webp, loop: 0, delay: Array(frames).fill(delay) })
      .toFile(fileURLToPath(new URL(poses.get(id).path, root)));
    console.log('Animated ' + id + ': ' + frames + ' frames at ' + poses.get(id).animation.fps + ' fps.');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await renderAnimations(process.argv[2]);
  const prefix = 'window.phantoCatalog = ';
  const text = readFileSync(new URL('catalog.js', root), 'utf8').trim();
  writeOrganizedPoses(JSON.parse(text.slice(prefix.length, -1)));
}
