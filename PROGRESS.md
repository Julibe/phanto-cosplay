# Asset maintenance progress (updated 2026-11-19)

## Done
- `main` is synced with origin. Only `main` exists locally.
- Grids: I re-checked every sheet that `tools/match.py` flagged, using `tools/rematch.py`, a colour-invariant match against `squirlce-emojis`, and confirmed by eye.
  - These were already fully split: grids 03, 04, 05, 07, 08, 10-bonus and `collections/phanto-sesame-street`, where every cell has an exact sprite. The old flag was a background or colour artefact. `collections/phanto-muppets-original-5x5` is also complete: all 25 characters exist as `-posing` and `-posing-02`, and the 1254 px size only mis-cuts the boxes.
  - Exported: all 37 unmatched cells of `phanto-grid-01`, `-02` and `-06`. These are earlier renders, each exported as its own sprite. `tools/export-plan.json` maps cell to base, and `tools/export_cells.py` writes `<base>-pose-NN` with the next free number and never overwrites. grid-01 r2c4 became `emoji-playful-laughing-wink`. None were skipped as exact or trim duplicates.
- Export spec: 1024 PNG (trimmed, fit to 840, centred) and a 320 RGBA WebP, LANCZOS, quality 88, method 4. `tools/q.py` found that setting reproduces existing exports byte for byte.
- Cell extraction removes slivers of neighbouring cells that are baked into the sheets. It cuts a 6 px edge band before labelling, drops small edge-touching parts, and drops specks under 0.15% of the body.
- `catalog.mjs` now reads `../squirlce/squirlce-emojis/`. `pose-assets.mjs` treats `science-fiction` as a multiword group, so new `costume-science-fiction-*` variants sit next to the originals.
- Catalog: 3,672 assets, and all paths resolve locally over HTTP. The 37 new sprites are released 2026-11-19 and carry the New tag.
- Duplicates (`tools/dup.py <role>`, results in `tools/dups-<role>.json`):
  - Grids: 156 sheets with no duplicates. The dHash hits are layout noise.
  - Dist: no exact duplicates, and 35 near pairs left to decide.
  - Sprites: 7 exact duplicates. These are the pre-rename `meme-*` PNGs of the approved memes, now moved to `squirlce/.review/squirlce-emojis/`.
  - Details are in `squirlce/.review/REVIEW.md`, with a copy in `tools/REVIEW.md`. Nothing was deleted.

## Open
- Decide the 35 near pairs in REVIEW.md. About 17 are effectively the same image (`-posing` vs `-posing-02`, thumbdiff under 5), and the rest are real pose variants.
- 18 non-duplicate `meme-*` PNGs remain in `squirlce-emojis`. They're excluded from the catalog on purpose.

## Notes
- Node needs `git` on PATH for `release-dates.mjs`: `C:\Users\Julibe\AppData\Local\GitHubDesktop\app-3.6.11\resources\app\git\cmd`.
- Python tools need `pillow numpy scipy` (and `imagehash`, optional).
- When editing `.mjs` files from PowerShell 5.1, preserve the UTF-8 encoding: `Get-Content`/`Set-Content` turn "Día" into mojibake.
