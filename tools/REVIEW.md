# Review queue

Nothing here was deleted. Files keep their path relative to `A:/julibe/phanto/emojis/squirlce/`; move one back to restore it.

## Moved: exact duplicates (7)

Each is byte-identical to a catalogued sprite. These are the pre-rename `meme-*` source PNGs of the seven approved memes. `catalog.mjs` excludes `meme-*`, and no file path references them (`pose-renames.json` keeps the stems only as link aliases).

| moved | identical to (kept) |
|---|---|
| `squirlce-emojis/meme-keyboard-cat.png` | `squirlce-emojis/animal-cat-playing-keyboard.png` |
| `squirlce-emojis/meme-arthur-fist.png` | `squirlce-emojis/emoji-anger-clenching-in-yellow-sweater.png` |
| `squirlce-emojis/meme-this-is-fine.png` | `squirlce-emojis/emoji-calm-sipping-coffee-amid-flames.png` |
| `squirlce-emojis/meme-gigachad.png` | `squirlce-emojis/emoji-confidence-smug-bearded-glance.png` |
| `squirlce-emojis/meme-is-this-a-pigeon.png` | `squirlce-emojis/emoji-confusion-is-this-a-pigeon.png` |
| `squirlce-emojis/meme-disaster-girl.png` | `squirlce-emojis/emoji-mischief-smirking-by-a-burning-house.png` |
| `squirlce-emojis/meme-surprised-pikachu.png` | `squirlce-emojis/emoji-surprise-pikachu-gasp.png` |

## Moved: chosen duplicate (1)

`emoji-disappointment-sad-side-glance` duplicates `emoji-disappointment-looking-away-sad` (Julibe chose to keep looking-away-sad). I moved its WebP to `.review/dist/emoji/disappointment/` and its PNG to `.review/squirlce-emojis/`. `pose-renames.json` maps `emoji-disappointment-looking-away-sad` ← `emoji-disappointment-sad-side-glance`, so old shared links still resolve.

## Moved: pixel-identical duplicates (2)

These `-posing-03` sprites are pixel-identical to `-posing-02` (0.0% of pixels differ; only the file encoding differs). I moved the WebP to `.review/dist/...` and the PNG to `.review/squirlce-emojis/`. In `pose-renames.json`, the `-02` entry is now a list: its own previous id first, then the retired `-03` ids, so old `-03` links open `-02`.

- `comics-invincible-omni-man-posing-03` → kept `comics-invincible-omni-man-posing-02`
- `game-super-mario-princess-peach-posing-03` → kept `game-super-mario-princess-peach-posing-02`

## Near pairs on dist (35, not moved)

Originally flagged by the 64-bit dHash (≤4 bits), which was too coarse: same-body poses with different faces matched. `tools/dup.py` now filters on the 256-bit dHash (≤12 bits). `thumbdiff` is the mean abs RGB diff on 64px thumbs: below ~5 is effectively the same image (`-posing` vs `-posing-02`), and above 8 is a real pose variant. Each has a matching sprite PNG pair.

| a | b | ham | thumbdiff | hint |
|---|---|---|---|---|
| `App/dist/comics/invincible/comics-invincible-omni-man-posing-02.webp` | `App/dist/comics/invincible/comics-invincible-omni-man-posing-03.webp` | 0 | 0.57 | duplicate: kept `comics-invincible-omni-man-posing-02`, moved `comics-invincible-omni-man-posing-03` |
| `App/dist/game/super-mario/game-super-mario-princess-peach-posing-02.webp` | `App/dist/game/super-mario/game-super-mario-princess-peach-posing-03.webp` | 0 | 0.68 | duplicate: kept `game-super-mario-princess-peach-posing-02`, moved `game-super-mario-princess-peach-posing-03` |
| `App/dist/game/super-mario/game-super-mario-princess-peach-posing-03.webp` | `App/dist/game/super-mario/game-super-mario-princess-peach-posing.webp` | 0 | 1.74 | keep both — different poses |
| `App/dist/game/super-mario/game-super-mario-princess-peach-posing-02.webp` | `App/dist/game/super-mario/game-super-mario-princess-peach-posing.webp` | 0 | 1.76 | keep both — different poses |
| `App/dist/game/donkey-kong/game-donkey-kong-donkey-kong-posing-02.webp` | `App/dist/game/donkey-kong/game-donkey-kong-donkey-kong-posing.webp` | 0 | 1.84 | keep both — different poses |
| `App/dist/comics/marvel/comics-marvel-silver-surfer-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-silver-surfer-posing.webp` | 1 | 2.29 | keep both — different poses |
| `App/dist/comics/marvel/comics-marvel-jubilee-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-jubilee-posing.webp` | 1 | 2.30 | keep both — different poses |
| `App/dist/comics/marvel/comics-marvel-storm-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-storm-posing.webp` | 0 | 2.31 | keep both — different poses |
| `App/dist/comics/marvel/comics-marvel-spider-gwen-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-spider-gwen-posing.webp` | 1 | 2.37 | keep both — different poses |
| `App/dist/comics/marvel/comics-marvel-cyclops-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-cyclops-posing.webp` | 1 | 2.51 | keep both — different poses |
| `App/dist/comics/marvel/comics-marvel-human-torch-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-human-torch-posing.webp` | 1 | 2.76 | keep both — different poses |
| `App/dist/comics/marvel/comics-marvel-gambit-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-gambit-posing.webp` | 1 | 3.09 | keep both — different poses |
| `App/dist/comics/marvel/comics-marvel-crystal-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-crystal-posing.webp` | 0 | 3.54 | keep both — different poses |
| `App/dist/movie/star-wars/movie-star-wars-padme-amidala-posing-02.webp` | `App/dist/movie/star-wars/movie-star-wars-padme-amidala-posing.webp` | 3 | 3.54 | keep both — different poses |
| `App/dist/comics/marvel/comics-marvel-the-thing-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-the-thing-posing.webp` | 0 | 3.57 | keep both — different poses |
| `App/dist/comics/marvel/comics-marvel-blade-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-blade-posing.webp` | 1 | 3.76 | keep both — different poses |
| `App/dist/comics/marvel/comics-marvel-x-23-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-x-23-posing.webp` | 1 | 3.87 | keep both — different poses |
| `App/dist/comics/marvel/comics-marvel-cable-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-cable-posing.webp` | 0 | 4.05 | keep both — different poses |
| `App/dist/emoji/neutral/emoji-neutral-neutral.webp` | `App/dist/emoji/skepticism/emoji-skepticism-deadpan.webp` | 4 | 8.31 | keep both — different poses |
| `App/dist/berry/berry-disappointed-frown.webp` | `App/dist/berry/berry-narrow-eyed-stare.webp` | 2 | 9.92 | keep both — different poses |
| `App/dist/emoji/calm/emoji-calm-small-smile.webp` | `App/dist/emoji/neutral/emoji-neutral-neutral.webp` | 4 | 10.21 | keep both — different poses |
| `App/dist/emoji/disappointment/emoji-disappointment-looking-away-sad.webp` | `App/dist/emoji/disappointment/emoji-disappointment-sad-side-glance.webp` | 3 | 10.99 | duplicate: kept `emoji-disappointment-looking-away-sad`, moved `emoji-disappointment-sad-side-glance` (see below) |
| `App/dist/berry/berry-disappointed-frown.webp` | `App/dist/berry/berry-silent-rage.webp` | 4 | 11.19 | keep both — different poses |
| `App/dist/berry/berry-narrow-eyed-stare.webp` | `App/dist/berry/berry-simmering-rage.webp` | 4 | 11.47 | keep both — different poses |
| `App/dist/berry/berry-deeply-frustrated.webp` | `App/dist/berry/berry-silent-rage.webp` | 4 | 11.62 | keep both — different poses |
| `App/dist/emoji/calm/emoji-calm-small-smile.webp` | `App/dist/emoji/skepticism/emoji-skepticism-deadpan.webp` | 4 | 11.93 | keep both — different poses |
| `App/dist/emoji/calm/emoji-calm-small-smile.webp` | `App/dist/emoji/rotation/emoji-rotation-front-serene.webp` | 3 | 12.56 | keep both — different poses |
| `App/dist/berry/berry-narrow-eyed-stare.webp` | `App/dist/berry/berry-silent-rage.webp` | 4 | 12.59 | keep both — different poses |
| `App/dist/berry/berry-disappointed-frown.webp` | `App/dist/berry/berry-simmering-rage.webp` | 4 | 12.63 | keep both — different poses |
| `App/dist/emoji/neutral/emoji-neutral-neutral.webp` | `App/dist/emoji/rotation/emoji-rotation-front-serene.webp` | 3 | 13.85 | keep both — different poses |
| `App/dist/emoji/expressions/emoji-expressions-sad.webp` | `App/dist/emoji/expressions/emoji-expressions-tear.webp` | 4 | 14.71 | keep both — different poses |
| `App/dist/emoji/rotation/emoji-rotation-front-serene.webp` | `App/dist/emoji/skepticism/emoji-skepticism-deadpan.webp` | 3 | 15.68 | keep both — different poses |
| `App/dist/emoji/expressions/emoji-expressions-anxious.webp` | `App/dist/emoji/expressions/emoji-expressions-tear.webp` | 4 | 15.94 | keep both — different poses |
| `App/dist/emoji/activity/emoji-activity-fishing.webp` | `App/dist/emoji/affection/emoji-affection-holding-rose.webp` | 4 | 20.13 | keep both — different poses |
| `App/dist/emoji/activity/emoji-activity-playing-with-toy-car.webp` | `App/dist/emoji/playful/emoji-playful-mischievous.webp` | 4 | 25.57 | keep both — different poses |

## New grid exports: near pairs (15, info only, not moved)

These come from re-running `tools/dup.py dist` with the 256-bit filter (≤12 bits of 256). Each involves one of the 37 sprites exported from grids 01, 02 and 06. They were exported on purpose ("export everything"). A few pair with a different existing sprite rather than their base pose, e.g. `emoji-playful-laughing-wink` ↔ `emoji-joy-sideways-laugh`.

| a | b | 256-bit | thumbdiff | status |
|---|---|---|---|---|
| `emoji-activity-eating-popcorn-pose-03` | `emoji-activity-eating-popcorn` | 1 | 1.60 | decide |
| `emoji-joy-big-open-smile-pose-02` | `emoji-joy-big-open-smile` | 2 | 1.58 | decide |
| `emoji-joy-sideways-laugh` | `emoji-playful-laughing-wink` | 2 | 2.12 | decide |
| `emoji-joy-gleeful-side-glance` | `emoji-surprise-starstruck-pose-02` | 3 | 1.46 | decide |
| `costume-classic-astronaut-pose-03` | `costume-classic-astronaut` | 4 | 1.62 | decide |
| `emoji-playful-goofy-tongue-pose-02` | `emoji-playful-wink-and-tongue-pose-03` | 4 | 1.79 | decide |
| `emoji-surprise-shocked-scream-pose-02` | `emoji-surprise-shocked-scream` | 5 | 1.82 | decide |
| `emoji-affection-kiss-with-heart-pose-02` | `emoji-affection-kiss-with-heart` | 6 | 2.16 | decide |
| `emoji-playful-goofy-tongue-pose-03` | `emoji-playful-goofy-tongue` | 6 | 1.53 | decide |
| `emoji-sleepy-yawning-pose-02` | `emoji-sleepy-yawning` | 6 | 1.69 | decide |
| `emoji-affection-blowing-kiss-pose-02` | `emoji-affection-blowing-kiss` | 7 | 1.71 | decide |
| `emoji-activity-hula-hoop-pose-02` | `emoji-activity-hula-hoop` | 8 | 1.61 | decide |
| `emoji-joy-tears-of-joy-pose-02` | `emoji-sadness-teary-eyed` | 9 | 2.17 | decide |
| `emoji-joy-delighted-wink-pose-02` | `emoji-playful-winking` | 11 | 2.51 | decide |
| `emoji-accessory-gaming-controller-pose-02` | `emoji-accessory-gaming-controller` | 12 | 3.97 | decide |

## Exported from grids (not review items)

37 unmatched cells from `phanto-grid-01`, `-02` and `-06` were exported as new sprites. The list is in `App/tools/export-plan.json`. Variants are named `<existing>-pose-NN`, and the grid-01 r2c4 laughing wink is `emoji-playful-laughing-wink`.

## Checked, nothing flagged

- Grids: 156 sheets with no exact/pixel/trim duplicates. The 1,263 dHash "near" hits are layout noise (the lowest thumbdiff is 17.4).
- Names and placement: there are no non-PNG files or subfolders in `squirlce-emojis`, and none in `squicle-grids`. Dist placement was already verified by `tools/names.mjs`.
