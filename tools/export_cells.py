"""Export grid cells as new sprites: 1024 PNG (trim, fit 840, centre) + 320 RGBA WebP.
Names: <base>-pose-NN with the next free NN; never overwrites. Skips exact/trim duplicates.
Usage: python export_cells.py plan.json [--dry]"""
import json, sys, os, glob, hashlib
import numpy as np
from PIL import Image
from scipy import ndimage

G = 'A:/julibe/phanto/emojis/squirlce/squicle-grids/'
SP = 'A:/julibe/phanto/emojis/squirlce/squirlce-emojis/'
D = 'A:/julibe/phanto/emojis/App/dist/'
Q = dict(quality=int(os.environ.get('WEBP_Q', 88)), method=4)  # tools/q.py: exact match to existing exports


def extract(im, box, band=6, near=6, minfrac=0.15, speck=0.0015):
    """Exact cell; drop slivers of neighbouring cells baked into the sheet.
    A thin edge band is cut before labelling so slivers that merge with the body across the edge separate.
    Kept: components not touching the cell edge, plus any >= minfrac of the largest."""
    a = np.asarray(im.crop(box)).copy()
    m = a[..., 3] > 8
    m[:band] = m[-band:] = False; m[:, :band] = m[:, -band:] = False
    lab, n = ndimage.label(m)
    if not n: return Image.fromarray(a)
    area = np.bincount(lab.ravel(), minlength=n + 1); big = area[1:].max()
    keep = np.zeros(n + 1, bool)
    H, W = m.shape
    for i, (ys, xs) in enumerate(ndimage.find_objects(lab), 1):
        edge = ys.start <= near or xs.start <= near or ys.stop >= H - near or xs.stop >= W - near
        keep[i] = (area[i] >= minfrac * big or not edge) and area[i] >= speck * big
    a[~keep[lab]] = 0
    return Image.fromarray(a)


def fit(c, size=1024, box=840):
    c = c.crop(c.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox())
    s = box / max(c.size)
    c = c.resize((max(1, round(c.width * s)), max(1, round(c.height * s))), Image.LANCZOS)
    out = Image.new('RGBA', (size, size)); out.paste(c, ((size - c.width) // 2, (size - c.height) // 2))
    return out


def trimhash(img):
    a = img.convert('RGBA'); t = a.crop(a.getchannel('A').getbbox())
    return hashlib.sha256(str(t.size).encode() + t.tobytes()).hexdigest()


def free_name(base, taken):
    for n in range(2, 100):
        stem = '%s-pose-%02d' % (base, n)
        if stem not in taken: return stem


plan = json.load(open(sys.argv[1])); dry = '--dry' in sys.argv
gm = json.load(open(os.path.dirname(os.path.abspath(__file__)) + '/gridmatch.json'))
taken = {os.path.basename(p)[:-4] for p in glob.glob(SP + '*.png')} | \
        {os.path.basename(p)[:-5] for p in glob.glob(D + '**/*.webp', recursive=True)}
existing = None
log = []
for g, cells in plan.items():
    im = Image.open(G + g).convert('RGBA')
    boxes = {'%d%d' % tuple(c['cell']): c['box'] for c in gm[g]['cells'] if 'box' in c}
    for key, base in cells.items():
        out = fit(extract(im, boxes[key]))
        stem = base if base not in taken and not os.path.exists(SP + base + '.png') else free_name(base, taken)
        if existing is None:
            existing = {trimhash(Image.open(p)): p for p in glob.glob(SP + '*.png')}
        if trimhash(out) in existing:
            log.append((g, key, 'SKIP dup of ' + os.path.basename(existing[trimhash(out)]))); continue
        assert not os.path.exists(SP + stem + '.png') and not os.path.exists(D + 'poses/' + stem + '.webp')
        taken.add(stem); log.append((g, key, stem))
        if dry: continue
        out.save(SP + stem + '.png', optimize=True)
        os.makedirs(D + 'poses', exist_ok=True)
        out.resize((320, 320), Image.LANCZOS).save(D + 'poses/' + stem + '.webp', 'WEBP', **Q)
for row in log: print(*row)
