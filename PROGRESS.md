# Asset maintenance progress (paused 2026-11-18)

## Done
- Synced `main` with origin (fast-forward to 180ad1e: CSS conflict fix, scrollbar, filter dropdowns, release dates). No conflict markers in `dist/style.css`.
- Branches: only `main` exists locally, and there are no stashes. `origin/claude/project-thread-s4arhq` was fully merged, so I deleted it.
- Worktrees I left in place: `../.catalog-release`, `outputs/portal-switch-publish-61930332`, `outputs/random-gallery-publish`, and one in a Codex temp folder. All their HEADs are in main. The portal-switch worktree has uncommitted CSS, but every added line already exists in main.
- Names and placement (`tools/names.mjs`): every dist WebP sits at its catalog path. All sprite stems are valid slugs with known prefixes. The only dist WebP not in the catalog is `icons/logo-horizontal-by.webp`, which is a UI asset.
- Dist duplicates (`tools/dup.py`): 3,636 WebPs. No exact byte, pixel, trimmed or trimmed+rescaled duplicates. 35 near pairs by perceptual hash (dHash ≤4), not yet reviewed. These are likely pose variants, so nothing has been moved.

## Inventory
- Grids: 156 sheets in `squirlce/squicle-grids` (12 top level, 137 in `collections/`, 7 in `collections/partial/`).
- Sprites: 3,660 PNGs in `squirlce/squirlce-emojis`. Every PNG has a dist WebP except the 25 `meme-*` PNGs, which `catalog.mjs` excludes on purpose.
- Path note: `catalog.mjs` reads `../squirlce-emojis/`, but the folder now lives at `A:/julibe/phanto/emojis/squirlce/squirlce-emojis`. Before running it, point it there with a junction or a path change.
- Node needs `git` on PATH for `release-dates.mjs`. On this PC git only comes with GitHub Desktop: `C:\Users\Julibe\AppData\Local\GitHubDesktop\app-3.6.11\resources\app\git\cmd`.

## Export spec (observed)
- 1024×1024 PNG sprites (from 5120² 5×5 sheets) → 320×320 RGBA WebP. 2,443 of them.
- Most 1024 PNGs are trimmed, scaled to fit an 840 px box and centred, which leaves a margin of about 92 px. 122 PNGs fill the full canvas.
- 256×256 PNG sprites (from 1280² sheets) → 256×256 WebP at the same size, with raw cell margins. 1,192 of them.
- WebP quality and method are not determined yet. `tools/q.py` brute-forces quality, method and resampling against existing exports, but it didn't finish.

## Grid status (`tools/match.py`, results in `tools/gridmatch.json`)
Each cell is trimmed and compared to the nearest sprite (RMS on a 24 px signature). Already-split sheets score below 0.06.
- Already split: every `collections/**` sheet, `phanto-grid-09-costumes`, `-11-anime-3d` and `-12-anime-3d`.
- Likely unsplit, with the number of cells above 0.06:
  - `phanto-grid-03`, `-04`, `-05`, `-07`, `-08`: 25 of 25 each
  - `phanto-grid-06`: 18
  - `phanto-grid-02`: 11
  - `phanto-grid-01`: 8
  - `phanto-grid-10-bonus`: 4
- Check by eye:
  - `phanto-muppets-original-5x5` (1254², 24 cells off): probably the odd size breaking the cell boxes, since PENDING.md says it was recovered.
  - `phanto-sesame-street` (1 cell off).
  - The early `phanto-grid-0x` sheets may simply be older drafts of poses that were later re-made. Before exporting, check each unmatched cell visually against `export/` (213 PNGs) as well.

## Resume steps
1. Add `C:\...\GitHubDesktop\...\git\cmd` to PATH, then `git pull origin main`.
2. Create a venv with `pillow numpy`. Run `tools/scan.py`, which writes `sprites.json`, then `tools/match.py`. Inspect the unmatched cells of the sheets listed above.
3. Finish `tools/q.py` to get the WebP quality. Export new sprites as 1024 PNGs (trim, fit 840, centre) and 320 WebPs to `dist/poses/`, named with the README patterns.
4. Run `tools/dup.py` for the sprite and grid roles; only the dist role finished. Move flagged files to `.review/` and write `.review/REVIEW.md`.
5. Run `node catalog.mjs` with the sprite path fixed, then `npm run build`. Serve `dist/` and check that every catalog path resolves.
