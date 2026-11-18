import glob, os, json, collections
from PIL import Image
import numpy as np

SP = 'A:/julibe/phanto/emojis/squirlce/squirlce-emojis/'
D = 'A:/julibe/phanto/emojis/App/dist/'
OUT = os.path.dirname(os.path.abspath(__file__))

webps = {os.path.basename(p)[:-5]: p for p in glob.glob(D + '**/*.webp', recursive=True)}
rows = {}
sizes = collections.Counter()
rel = collections.Counter()
for p in sorted(glob.glob(SP + '*.png')):
    stem = os.path.basename(p)[:-4]
    im = Image.open(p)
    im.load()
    a = im.convert('RGBA')
    bbox = a.getchannel('A').getbbox()
    rec = {'png': im.size, 'bbox': bbox}
    if stem in webps:
        w = Image.open(webps[stem])
        rec['webp'] = w.size
        rec['wbytes'] = os.path.getsize(webps[stem])
        rel[(im.size, w.size)] += 1
    # perceptual signature: crop to bbox, pad square, 24x24 RGBA premultiplied
    c = a.crop(bbox) if bbox else a
    s = max(c.size)
    sq = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    sq.paste(c, ((s - c.size[0]) // 2, (s - c.size[1]) // 2))
    arr = np.asarray(sq.resize((24, 24), Image.LANCZOS), dtype=np.float32) / 255
    sig = arr[..., :3] * arr[..., 3:4]
    rec['sig'] = np.concatenate([sig.ravel(), arr[..., 3].ravel()]).round(4).tolist()
    rows[stem] = rec
json.dump(rows, open(OUT + '/sprites.json', 'w'))
for k, v in rel.most_common(30):
    print(k, v)
