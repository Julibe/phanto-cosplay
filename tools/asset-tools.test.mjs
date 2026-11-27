import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

const helper = readFileSync(new URL('../dist/asset-tools.js', import.meta.url), 'utf8');
function tools() {
  const context = vm.createContext({ Uint8Array, Uint32Array, DataView, TextEncoder, Blob, URL });
  vm.runInContext(helper, context);
  return context.PhantoAssetTools;
}

test('metadata uses exact name and absolute versioned image URL, including subdirectory hosts', () => {
  const result = tools().metadata({ name: 'Día "happy"', category: 'Animation', path: 'animated/wave.webp?v=abc' }, 'https://example.org/gallery/?q=happy#pose');
  assert.deepEqual(JSON.parse(JSON.stringify(result)), { name: 'Día "happy"', imageUrl: 'https://example.org/gallery/animated/wave.webp?v=abc', category: 'Animation' });
});

test('asset metadata retains its category, type and group', () => {
  const result = tools().metadata({ name: 'Winter Tree', path: 'assets/vegetation/winter/tree.webp', category: 'Assets', assetType: 'Vegetation', assetGroup: 'winter' }, 'https://example.org/');
  assert.deepEqual(JSON.parse(JSON.stringify(result)), { name: 'Winter Tree', imageUrl: 'https://example.org/assets/vegetation/winter/tree.webp', category: 'Assets', assetType: 'Vegetation', assetGroup: 'winter' });
});

test('stored ZIP has correct CRC, UTF-8 filenames, offsets and byte-identical payloads', async () => {
  const files = [
    { name: 'phanto.webp', data: new TextEncoder().encode('123456789') },
    { name: 'día.webp', data: new Uint8Array([0, 255, 128, 42]) }
  ];
  const blob = tools().zip(files);
  const data = new Uint8Array(await blob.arrayBuffer()), view = new DataView(data.buffer);
  assert.equal(blob.type, 'application/zip');
  let offset = 0;
  const offsets = [];
  for (const file of files) {
    offsets.push(offset);
    assert.equal(view.getUint32(offset, true), 0x04034b50);
    assert.equal(view.getUint16(offset + 6, true), 0x800);
    assert.equal(view.getUint16(offset + 8, true), 0);
    const length = view.getUint16(offset + 26, true);
    assert.equal(new TextDecoder().decode(data.slice(offset + 30, offset + 30 + length)), file.name);
    assert.deepEqual(data.slice(offset + 30 + length, offset + 30 + length + file.data.length), file.data);
    assert.equal(view.getUint32(offset + 18, true), file.data.length);
    offset += 30 + length + file.data.length;
  }
  assert.equal(view.getUint32(14, true), 0xcbf43926); // Known CRC32 test vector.
  const directoryOffset = offset;
  for (const localOffset of offsets) {
    assert.equal(view.getUint32(offset, true), 0x02014b50);
    assert.equal(view.getUint32(offset + 42, true), localOffset);
    offset += 46 + view.getUint16(offset + 28, true);
  }
  assert.equal(view.getUint32(offset, true), 0x06054b50);
  assert.equal(view.getUint16(offset + 10, true), 2);
  assert.equal(view.getUint32(offset + 16, true), directoryOffset);
  assert.equal(view.getUint32(offset + 12, true), offset - directoryOffset);
  assert.equal(data.length, offset + 22);
});

test('selection threshold, bulk JSON, clipboard and failed ZIP handling', async () => {
  const controls = new Map(), downloads = [], messages = [], copied = [];
  function node(id) {
    if (!controls.has(id)) controls.set(id, { hidden: true, textContent: '', setAttribute() {}, addEventListener(event, fn) { this[event] = fn; } });
    return controls.get(id);
  }
  const context = vm.createContext({
    Uint8Array, Uint32Array, DataView, TextEncoder, Blob, URL, AbortController,
    document: { baseURI: 'https://example.org/gallery/' }, node,
    grid: { querySelectorAll: () => [] },
    navigator: { clipboard: { writeText: async text => copied.push(text) } },
    notify: message => messages.push(message),
    downloadBlob: (blob, name) => downloads.push({ blob, name }),
    fetch: async () => ({ ok: true, arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer })
  });
  vm.runInContext(helper, context);
  const app = readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8');
  const source = app.slice(app.indexOf('const selectedPoses ='), app.indexOf('// Clipboards hold still images'));
  // Use a download sink instead of the DOM URL-click implementation.
  vm.runInContext(source.replace(/function downloadBlob\(blob, name\) \{[\s\S]*?\n\}/, ''), context);
  vm.runInContext("selectedPoses.set('a', { id: 'a', name: 'One', category: 'Activities', path: 'a.webp' }); syncSelection();", context);
  assert.equal(node('bulk-actions').hidden, true);
  vm.runInContext("selectedPoses.set('b', { id: 'b', name: 'Two', category: 'Assets', assetType: 'Toys', assetGroup: 'car', path: 'b.webp' }); syncSelection();", context);
  assert.equal(node('bulk-actions').hidden, false);
  await vm.runInContext("copyPoseText('One', 'Title')", context);
  assert.deepEqual(copied, ['One']);
  node('bulk-json').click();
  assert.deepEqual(JSON.parse(await downloads[0].blob.text()), [
    { name: 'One', imageUrl: 'https://example.org/gallery/a.webp', category: 'Activities' },
    { name: 'Two', imageUrl: 'https://example.org/gallery/b.webp', category: 'Assets', assetType: 'Toys', assetGroup: 'car' }
  ]);
  await node('bulk-zip').click();
  assert.equal(downloads[1].name, 'phanto-selection.zip');
  assert.equal(node('bulk-zip').disabled, false);
  context.fetch = async () => ({ ok: false });
  await node('bulk-zip').click();
  assert.equal(downloads.length, 2, 'Failure must not download an incomplete ZIP');
  assert.match(messages.at(-1), /^ZIP failed/);
  node('clear-selection').click();
  assert.equal(node('bulk-actions').hidden, true);
});
