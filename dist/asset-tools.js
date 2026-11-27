'use strict';

// Small dependency-free ZIP writer. WebPs are already compressed, so store them
// unchanged (including animated WebPs) rather than recompressing their contents.
globalThis.PhantoAssetTools = (() => {
  const table = Uint32Array.from({ length: 256 }, (_, value) => {
    for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    return value >>> 0;
  });
  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) crc = table[(crc ^ byte) & 255] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }
  function metadata(pose, baseUrl) {
    return {
      name: pose.name,
      imageUrl: new URL(pose.path, baseUrl).href,
      category: pose.category,
      ...(pose.assetType ? { assetType: pose.assetType } : {}),
      ...(pose.assetGroup ? { assetGroup: pose.assetGroup } : {})
    };
  }
  function zip(files) {
    if (files.length > 65535) throw new Error('Too many files for one ZIP.');
    const local = [], central = [];
    let offset = 0, directorySize = 0;
    for (const file of files) {
      const name = new TextEncoder().encode(file.name);
      const data = file.data;
      if (name.length > 65535 || data.length > 0xffffffff) throw new Error('ZIP file is too large.');
      const crc = crc32(data);
      const header = new Uint8Array(30 + name.length), h = new DataView(header.buffer);
      h.setUint32(0, 0x04034b50, true);
      h.setUint16(4, 20, true);
      h.setUint16(6, 0x0800, true); // UTF-8 names, stored with no compression.
      h.setUint16(12, 33, true); // 1980-01-01, valid DOS date.
      h.setUint32(14, crc, true);
      h.setUint32(18, data.length, true);
      h.setUint32(22, data.length, true);
      h.setUint16(26, name.length, true);
      header.set(name, 30);
      const record = new Uint8Array(46 + name.length), r = new DataView(record.buffer);
      r.setUint32(0, 0x02014b50, true);
      r.setUint16(4, 20, true);
      r.setUint16(6, 20, true);
      r.setUint16(8, 0x0800, true);
      r.setUint16(14, 33, true);
      r.setUint32(16, crc, true);
      r.setUint32(20, data.length, true);
      r.setUint32(24, data.length, true);
      r.setUint16(28, name.length, true);
      r.setUint32(42, offset, true);
      record.set(name, 46);
      local.push(header, data);
      central.push(record);
      offset += header.length + data.length;
      directorySize += record.length;
      if (offset + directorySize > 0xffffffff) throw new Error('ZIP file is too large.');
    }
    const end = new Uint8Array(22), e = new DataView(end.buffer);
    e.setUint32(0, 0x06054b50, true);
    e.setUint16(8, files.length, true);
    e.setUint16(10, files.length, true);
    e.setUint32(12, directorySize, true);
    e.setUint32(16, offset, true);
    return new Blob([...local, ...central, end], { type: 'application/zip' });
  }
  return Object.freeze({ metadata, zip });
})();
