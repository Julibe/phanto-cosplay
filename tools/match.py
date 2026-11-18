import glob, os, json, re, sys
from PIL import Image
import numpy as np

OUT = os.path.dirname(os.path.abspath(__file__))
G = 'A:/julibe/phanto/emojis/squirlce/squicle-grids/'
rows = json.load(open(OUT + '/sprites.json'))
names = list(rows)
M = np.array([rows[n]['sig'] for n in names], dtype=np.float32)


def layout(path, im):
    n = os.path.basename(path)
    m = re.search(r'(\d)x(\d)', n)
    W, H = im.size
    if H * 5 == W: return 5, 1
    if m: return int(m.group(1)), int(m.group(2))
    if W == 3072: return 3, 3
    if W == 512: return 2, 2
    return 5, 5


def sig(cell):
    a = cell.convert('RGBA')
    al = np.asarray(a.getchannel('A'))
    if al.min() == 255:  # opaque: key out the corner colour
        arr = np.asarray(a).astype(np.int16)
        bg = arr[2, 2, :3]
        mask = (np.abs(arr[..., :3] - bg).sum(-1) > 30)
        al = (mask * 255).astype(np.uint8)
        a.putalpha(Image.fromarray(al))
    m = Image.fromarray(((al > 8) * 255).astype(np.uint8))
    bbox = m.getbbox()
    if not bbox: return None, None
    c = a.crop(bbox)
    s = max(c.size)
    sq = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    sq.paste(c, ((s - c.size[0]) // 2, (s - c.size[1]) // 2))
    arr = np.asarray(sq.resize((24, 24), Image.LANCZOS), dtype=np.float32) / 255
    sg = arr[..., :3] * arr[..., 3:4]
    return np.concatenate([sg.ravel(), arr[..., 3].ravel()]), bbox


res = {}
for path in sorted(glob.glob(G + '**/*.png', recursive=True)):
    im = Image.open(path); im.load()
    cols, rws = layout(path, im)
    cw, ch = im.size[0] / cols, im.size[1] / rws
    cells = []
    for r in range(rws):
        for c in range(cols):
            box = (round(c * cw), round(r * ch), round((c + 1) * cw), round((r + 1) * ch))
            s, bbox = sig(im.crop(box))
            if s is None:
                cells.append({'cell': [r, c], 'empty': True}); continue
            d = np.sqrt(((M - s) ** 2).mean(1))
            i = int(d.argmin())
            cells.append({'cell': [r, c], 'box': box, 'match': names[i], 'dist': round(float(d[i]), 4)})
    rel = os.path.relpath(path, G).replace('\\', '/')
    res[rel] = {'layout': [cols, rws], 'cells': cells}
    ds = [x['dist'] for x in cells if 'dist' in x]
    print(rel, cols, rws, 'median %.3f max %.3f' % (np.median(ds), max(ds)), sum(d > 0.06 for d in ds), flush=True)
json.dump(res, open(OUT + '/gridmatch.json', 'w'), indent=1)
