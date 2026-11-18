import glob, os, io, json
from PIL import Image
import numpy as np
SP = 'A:/julibe/phanto/emojis/squirlce/squirlce-emojis/'
D = 'A:/julibe/phanto/emojis/App/dist/'
webps = {os.path.basename(p)[:-5]: p for p in glob.glob(D + '**/*.webp', recursive=True)}
stems = ['animal-bear-posing', 'emoji-anxiety-worried', 'costume-classic-cowboy', 'tv-avatar-aang-posing', 'game-persona-5-joker-posing']
stems += sorted(webps, key=lambda s: os.path.getmtime(webps[s]))[-3:]
for stem in stems:
    src = Image.open(SP + stem + '.png').convert('RGBA')
    ref = Image.open(webps[stem]).convert('RGBA')
    rb = os.path.getsize(webps[stem])
    R = np.asarray(ref, dtype=np.int16)
    best = []
    for resample in ['LANCZOS', 'BICUBIC', 'BILINEAR']:
        im = src.resize(ref.size, getattr(Image, resample)) if src.size != ref.size else src
        for q in [75, 80, 82, 85, 88, 90, 92, 95]:
            for m in [4, 6]:
                b = io.BytesIO(); im.save(b, 'WEBP', quality=q, method=m)
                t = Image.open(io.BytesIO(b.getvalue())).convert('RGBA')
                diff = np.abs(np.asarray(t, dtype=np.int16) - R).mean()
                best.append((diff, abs(len(b.getvalue()) - rb), resample, q, m, len(b.getvalue())))
    best.sort()
    print(stem, rb, best[:3])
