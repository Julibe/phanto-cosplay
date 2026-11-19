"""Colour-invariant match of grid cells vs squircle sprites. Writes sheets of cells with top match."""
import json, glob, sys, os, pickle
import numpy as np
from PIL import Image, ImageDraw, ImageOps
S = os.path.dirname(os.path.abspath(__file__))
G = 'A:/julibe/phanto/emojis/squirlce/squicle-grids/'
SP = 'A:/julibe/phanto/emojis/squirlce/squirlce-emojis/'
N = 32


def sig(a):
    a = a.convert('RGBA')
    al = np.asarray(a.getchannel('A'))
    if al.min() == 255:
        arr = np.asarray(a).astype(np.int16); bg = arr[2, 2, :3]
        al = ((np.abs(arr[..., :3] - bg).sum(-1) > 30) * 255).astype(np.uint8)
        a = a.copy(); a.putalpha(Image.fromarray(al))
    bbox = Image.fromarray(((al > 8) * 255).astype(np.uint8)).getbbox()
    if not bbox: return None
    c = a.crop(bbox); s = max(c.size)
    sq = Image.new('RGBA', (s, s)); sq.paste(c, ((s - c.size[0]) // 2, (s - c.size[1]) // 2))
    arr = np.asarray(sq.resize((N, N), Image.LANCZOS), dtype=np.float32) / 255
    A = arr[..., 3]; L = arr[..., :3].mean(-1)
    m = A > .5
    if m.sum() < 10: return None
    Ln = (L - L[m].mean()) / (L[m].std() + 1e-6) * m
    gx = np.diff(Ln, axis=1, append=0); gy = np.diff(Ln, axis=0, append=0)
    return np.concatenate([A.ravel() * 2, Ln.ravel() * .5, gx.ravel(), gy.ravel()])


cache = S + '/refsig.pkl'
if os.path.exists(cache):
    refs, R = pickle.load(open(cache, 'rb'))
else:
    refs = sorted(glob.glob(SP + '*.png'))
    refs = [p.replace('\\', '/') for p in refs]
    R = []
    keep = []
    for p in refs:
        s = sig(Image.open(p))
        if s is not None: R.append(s); keep.append(p)
    refs, R = keep, np.array(R, dtype=np.float32)
    pickle.dump((refs, R), open(cache, 'wb'))
gm = json.load(open('A:/julibe/phanto/emojis/App/tools/gridmatch.json'))
out = {}
for g in sys.argv[2:]:
    im = Image.open(G + g).convert('RGBA')
    T = 150; cells = gm[g]['cells']; cols, rows = gm[g]['layout']
    sheet = Image.new('RGB', (cols * (T * 2 + 6), rows * (T + 16)), 'white'); dr = ImageDraw.Draw(sheet)
    res = []
    for c in cells:
        if c.get('empty'): continue
        a = im.crop(c['box']); s = sig(a)
        d = np.sqrt(((R - s) ** 2).mean(1)); i = int(d.argmin())
        nm = refs[i].split('/emojis/')[1]
        res.append({'cell': c['cell'], 'box': c['box'], 'm': nm, 'd': round(float(d[i]), 3)})
        r, k = c['cell']; x = k * (2 * T + 6); y = r * (T + 16)
        t = a.resize((T, T)); sheet.paste(t, (x, y), t)
        m = Image.open(refs[i]).convert('RGBA').resize((T, T)); sheet.paste(m, (x + T, y), m)
        dr.text((x, y + T), f"{r}{k} {d[i]:.3f} {os.path.basename(nm)[-30:]}", fill='black')
    out[g] = res
    sheet.save(f"{sys.argv[1]}/n-{os.path.basename(g)[:-4]}.jpg", quality=80)
    print(g, ' '.join(f"{c['cell'][0]}{c['cell'][1]}:{c['d']}" for c in res), flush=True)
json.dump(out, open(sys.argv[1] + '/nm.json', 'w'), indent=1)
