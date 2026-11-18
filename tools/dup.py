"""Duplicate scan. Roles compared separately: dist webps, sprite pngs, grid pngs."""
import glob, os, json, hashlib, collections
from PIL import Image
import numpy as np

OUT = os.path.dirname(os.path.abspath(__file__))
ROLES = {
    'dist': glob.glob('A:/julibe/phanto/emojis/App/dist/**/*.webp', recursive=True),
    'sprites': glob.glob('A:/julibe/phanto/emojis/squirlce/squirlce-emojis/*.png'),
    'grids': glob.glob('A:/julibe/phanto/emojis/squirlce/squicle-grids/**/*.png', recursive=True),
}


def dhash(img, n=8):
    g = np.asarray(img.convert('L').resize((n + 1, n), Image.LANCZOS), dtype=np.int16)
    bits = (g[:, 1:] > g[:, :-1]).ravel()
    return int(''.join('1' if b else '0' for b in bits), 2)


def info(p):
    raw = open(p, 'rb').read()
    im = Image.open(p); im.load(); a = im.convert('RGBA')
    flat = Image.new('RGBA', a.size, (255, 0, 255, 255)); flat.alpha_composite(a)
    arr = np.asarray(a)
    mask = arr[..., 3] > 8
    if mask.all():  # strip uniform solid border colour
        bg = arr[0, 0, :3].astype(np.int16)
        mask = np.abs(arr[..., :3].astype(np.int16) - bg).sum(-1) > 24
    ys, xs = np.nonzero(mask)
    if len(xs):
        bbox = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    else:
        bbox = (0, 0) + a.size
    t = a.crop(bbox)
    tf = Image.new('RGBA', t.size, (255, 0, 255, 255)); tf.alpha_composite(t)
    s = 256 / max(t.size)
    t256 = tf.resize((max(1, round(t.size[0] * s)), max(1, round(t.size[1] * s))), Image.LANCZOS)
    thumb = np.asarray(tf.resize((64, 64), Image.LANCZOS).convert('RGB'), dtype=np.float32)
    return {
        'sha': hashlib.sha256(raw).hexdigest(),
        'pix': hashlib.sha256(str(a.size).encode() + flat.tobytes()).hexdigest(),
        'trim': hashlib.sha256(str(t.size).encode() + tf.tobytes()).hexdigest(),
        'trim256': hashlib.sha256(t256.tobytes()).hexdigest(),
        'dh': dhash(tf), 'dh16': dhash(tf, 16), 'thumb': thumb, 'size': a.size,
    }


report = {}
for role, files in ROLES.items():
    data = {}
    for p in files:
        data[p.replace('\\', '/')] = info(p)
    groups = {}
    for key in ['sha', 'pix', 'trim', 'trim256']:
        g = collections.defaultdict(list)
        for p, d in data.items(): g[d[key]].append(p)
        groups[key] = [sorted(v) for v in g.values() if len(v) > 1]
    # perceptual near matches (only pairs not already exact-ish)
    exact = {frozenset(v) for k in groups for v in groups[k]}
    ps = list(data)
    H = np.array([data[p]['dh'] for p in ps], dtype=np.uint64)
    near = []
    for i, p in enumerate(ps):
        x = np.bitwise_xor(H[i + 1:], H[i])
        ham = np.array([bin(int(v)).count('1') for v in x])
        for j in np.nonzero(ham <= 4)[0]:
            q = ps[i + 1 + j]
            h16 = bin(data[p]['dh16'] ^ data[q]['dh16']).count('1')
            diff = float(np.abs(data[p]['thumb'] - data[q]['thumb']).mean())
            near.append({'a': p, 'b': q, 'ham': int(ham[j]), 'ham256': h16, 'thumbdiff': round(diff, 2)})
    report[role] = {'count': len(data), 'groups': groups, 'near': near}
    print(role, len(data), {k: len(v) for k, v in groups.items()}, 'near', len(near), flush=True)
json.dump(report, open(OUT + '/dups.json', 'w'), indent=1)
