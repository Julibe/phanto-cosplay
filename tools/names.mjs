import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
const app = 'A:/julibe/phanto/emojis/App/';
const text = readFileSync(app + 'dist/catalog.js', 'utf8').trim();
const cat = JSON.parse(text.slice('window.phantoCatalog = '.length, -1));
const paths = new Map(cat.map(p => [p.id, p.path]));
const walk = d => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const prefix = /^(holiday|anime|tv|movie|game|comics|book|music|genre|costume|animal|meme|emoji|berry|cosplay|rotation)-/;
const out = { notInCatalog: [], misplaced: [], badSlug: [], badPrefix: [], oddSuffix: [], typos: [] };
for (const f of walk(app + 'dist').filter(f => f.endsWith('.webp'))) {
  const rel = relative(app + 'dist', f).replaceAll('\\', '/');
  const stem = rel.split('/').pop().slice(0, -5);
  if (!paths.has(stem)) out.notInCatalog.push(rel);
  else if (paths.get(stem) !== rel) out.misplaced.push([rel, paths.get(stem)]);
}
const sprites = readdirSync('A:/julibe/phanto/emojis/squirlce/squirlce-emojis');
for (const n of sprites) {
  const stem = n.replace(/\.png$/, '');
  if (!n.endsWith('.png') || !slug.test(stem)) out.badSlug.push(n);
  else if (!prefix.test(stem)) out.badPrefix.push(n);
  if (/(-copy|-final|-new|-old|-v\d+|-\d{3,}|-tmp|-test|--)/.test(stem) || /\(\d+\)/.test(n)) out.oddSuffix.push(n);
  if (/(posng|posign|psoing|-ture-|smlie|happpy|hapy|squirlce|phanot)/.test(stem)) out.typos.push(n);
}
for (const n of readdirSync('A:/julibe/phanto/emojis/squirlce/squicle-grids', { recursive: true })) {
  const base = n.split(/[\\/]/).pop();
  if (base.includes('.') && !/^[a-z0-9-]+\.png$/.test(base)) out.badSlug.push('grids/' + n);
}
console.log(JSON.stringify(out, null, 1));
console.log('catalog', cat.length, 'sample', JSON.stringify(cat[0]));
