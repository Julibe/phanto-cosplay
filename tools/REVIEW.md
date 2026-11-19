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

## Near pairs on dist (35, not moved)

dHash ≤4 on the dist WebPs. `thumbdiff` is the mean abs RGB diff on 64px thumbs: below ~5 is effectively the same image (`-posing` vs `-posing-02`), and above 8 is a real pose variant. Each has a matching sprite PNG pair.

| a | b | ham | thumbdiff | hint |
|---|---|---|---|---|
| `App/dist/comics/invincible/comics-invincible-omni-man-posing-02.webp` | `App/dist/comics/invincible/comics-invincible-omni-man-posing-03.webp` | 0 | 0.57 | decide |
| `App/dist/game/super-mario/game-super-mario-princess-peach-posing-02.webp` | `App/dist/game/super-mario/game-super-mario-princess-peach-posing-03.webp` | 0 | 0.68 | decide |
| `App/dist/game/super-mario/game-super-mario-princess-peach-posing-03.webp` | `App/dist/game/super-mario/game-super-mario-princess-peach-posing.webp` | 0 | 1.74 | decide |
| `App/dist/game/super-mario/game-super-mario-princess-peach-posing-02.webp` | `App/dist/game/super-mario/game-super-mario-princess-peach-posing.webp` | 0 | 1.76 | decide |
| `App/dist/game/donkey-kong/game-donkey-kong-donkey-kong-posing-02.webp` | `App/dist/game/donkey-kong/game-donkey-kong-donkey-kong-posing.webp` | 0 | 1.84 | decide |
| `App/dist/comics/marvel/comics-marvel-silver-surfer-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-silver-surfer-posing.webp` | 1 | 2.29 | decide |
| `App/dist/comics/marvel/comics-marvel-jubilee-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-jubilee-posing.webp` | 1 | 2.30 | decide |
| `App/dist/comics/marvel/comics-marvel-storm-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-storm-posing.webp` | 0 | 2.31 | decide |
| `App/dist/comics/marvel/comics-marvel-spider-gwen-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-spider-gwen-posing.webp` | 1 | 2.37 | decide |
| `App/dist/comics/marvel/comics-marvel-cyclops-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-cyclops-posing.webp` | 1 | 2.51 | decide |
| `App/dist/comics/marvel/comics-marvel-human-torch-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-human-torch-posing.webp` | 1 | 2.76 | decide |
| `App/dist/comics/marvel/comics-marvel-gambit-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-gambit-posing.webp` | 1 | 3.09 | decide |
| `App/dist/comics/marvel/comics-marvel-crystal-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-crystal-posing.webp` | 0 | 3.54 | decide |
| `App/dist/movie/star-wars/movie-star-wars-padme-amidala-posing-02.webp` | `App/dist/movie/star-wars/movie-star-wars-padme-amidala-posing.webp` | 3 | 3.54 | decide |
| `App/dist/comics/marvel/comics-marvel-the-thing-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-the-thing-posing.webp` | 0 | 3.57 | decide |
| `App/dist/comics/marvel/comics-marvel-blade-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-blade-posing.webp` | 1 | 3.76 | decide |
| `App/dist/comics/marvel/comics-marvel-x-23-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-x-23-posing.webp` | 1 | 3.87 | decide |
| `App/dist/comics/marvel/comics-marvel-cable-posing-02.webp` | `App/dist/comics/marvel/comics-marvel-cable-posing.webp` | 0 | 4.05 | decide |
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

## Exported from grids (not review items)

37 unmatched cells from `phanto-grid-01`, `-02` and `-06` were exported as new sprites. The list is in `App/tools/export-plan.json`. Variants are named `<existing>-pose-NN`, and the grid-01 r2c4 laughing wink is `emoji-playful-laughing-wink`.

## Checked, nothing flagged

- Grids: 156 sheets with no exact/pixel/trim duplicates. The 1,263 dHash "near" hits are layout noise (the lowest thumbdiff is 17.4).
- Names and placement: there are no non-PNG files or subfolders in `squirlce-emojis`, and none in `squicle-grids`. Dist placement was already verified by `tools/names.mjs`.
