# Phanto project handoff

**Single source of truth for project continuity. Current version: v0.0.2. Last reviewed: 2026-11-26 20:52 America/Bogota.**

Every AI agent must read this file before changing the project and update it after significant implementation. The user's current instructions override this document. Specialized reference documents explain mechanisms; they do not override the decisions here.

## v0.0.2 — Full catalog JSON and reachable portal chooser

- Date: 2026-11-27 (America/Bogota). Branch: main. Previous: v0.0.1. Status: implemented; rendered validation pending.
- Summary/Completed: single and bulk JSON now export every original catalog field (including tags, IDs, category, release date, franchise/emotion, aliases, animation metadata and path when present), plus absolute imageUrl. Runtime search-derived fields are excluded by resolving the raw catalog entry.
- Previously Pending — Resolved: none of the earlier visual tasks is declared resolved without rendering. Export schema implementation extended per user request.
- Previously Pending — Outstanding: all53 TASK/LEGACY rows below retain their IDs/status/origins. TASK-005 includes validating these closer menu offsets and the new300ms pointer-leave grace period. TASK-001 mobile layout remains pending.
- In Progress: no other implementation. New Pending: rendered verification of portal hover bridge and bulk/filter stacking (TASK-005).
- Issues/Resolutions: bulk chooser offset146px exceeded65px hover bridge, so the menu vanished while crossing. Reduced chooser offset58px, bulk pill92→60px, filter154→122px; extended pointer bridge to160px and added cancellable300ms close delay.
- Decisions: full original catalog metadata, shared single/bulk schema; preserve original WebP paths/revisions. No new assets or UI redesign. White-opacity backdrop blur and six-item row retained.
- Validation: export unit tests and JS syntax checks; no browser/live deployment claim. Version metadata synchronized.
- Next steps: carry forward consolidated backlog below; validate TASK-005 when authorized before marking visual behavior verified.

## v0.0.1 — Versioned continuity baseline and backlog reconciliation

- **Date:** 2026-11-26 20:52 America/Bogota (UTC-05:00).
- **Branch:** main.
- **Previous Version:** none; existing implementation was unversioned through `ba5d4acc`.
- **Status:** Completed documentation/metadata update; application validation remains incomplete. This is NOT a stable/production-ready declaration.
- **Version scope:** first recorded SemVer baseline for the existing project, not a claim that its earlier features were built in this update. Future updates increment from0.0.1; never reset or retroactively invent historical versions.

### Summary

Applied the explicitly requested `handoff-management` skill: versioned handoff entries, consolidated backlog, CHANGELOG, version metadata and a main-branch/tag publication protocol. No artwork generation, UI redesign or functional change.

### Completed

- Read the complete current handoff, dated progress/review records, historical backlog, recent commits, package metadata and current export/selection code.
- Reverified4,323 unique catalog IDs and image paths; all208 animation frame paths exist. Assets501, Activities839, animated WebPs11. Paper25, printer-success25 and printer-disaster25 entries are all present.
- Re-ran4 passing export tests, plus JS syntax checks for app.js, asset-tools.js and sw.js.
- Initialized package/root lock metadata at0.0.1; created CHANGELOG.md. No existing version/tag was found; earlier Git history remains untouched.
- Assigned persistent TASK/LEGACY IDs below. Preserved full pre-versioning HANDOFF and older snapshots in docs/history.

### Previously Pending — Resolved

Recorded previously completed work without claiming a new implementation: TASK-100 (missing broken-printer sheet), TASK-101 (copy/bulk/category exports), TASK-102 (handoff/design rules), TASK-103 (explicit bottle removal). The legacy branch-divergence/push-blocking claim is superseded; live-host verification remains TASK-003.

### Previously Pending — Outstanding

All unresolved items remain in the consolidated table. Origins are preserved as dated notes/commits where known; there were no original SemVer values. First versioned tracking is v0.0.1, not an invented introduction date. Historical franchise tasks mean source-sheet/catalog reconciliation is required; unchecked does NOT prove that all named content is absent.

### In Progress

No unrelated implementation is in progress in this update. TASK-004 visual review was paused by the user; documentation maintenance does not resume it. Current validation is source/file/unit-test based.

### New Pending Tasks

No unrelated product requirements added. TASK-005 explicitly carries forward the visual/real-browser validation gap for recently shipped selection/export controls. TASK-104 closes the requested workflow/documentation work.

### Blockers & Dependencies

Interactive browser work remains restricted by user instruction; earlier cloud headless approval and pause are historical and must be interpreted with the current request. Hosted publishing configuration and source-library restoration remain external dependencies. No blocker prevented this documentation update.

### Issues & Resolutions

Old top-level review dates, split status entries and permissive branch guidance no longer described the current workflow. Current state is reconciled here, earlier text is preserved below/as an archive. The documented mobile filter obstruction is still visible in source (grid-area:auto is on #berry-portal, not .portal-switches). Do not mark it fixed. Dock normal blending is implemented; visible blur validation is still pending.

### Technical Decisions

- Keep the canonical filename `HANDOFF.md` on Windows/Git; the skill's lowercase `handoff.md` refers to this same document. Do not add a case-only duplicate.
- Keep previous sections as the project reference/history; this newest-first version log and consolidated table govern current task status.
- Work only on main, no new branches/PRs, no force pushes/history rewrite. Existing backup branch is historical and retained. User authorship remains Julibe <mail@julibe.com>.
- Update HANDOFF and CHANGELOG and synchronize package.json/package-lock.json versions before each new versioned update; use a versioned commit and matching annotated tag. Runtime manifest has no standard release-version field, so no invented PWA field was added.
- Skill adoption does not authorize unrelated bug fixes, art generation, deduplication or browser usage. Unresolved work is recorded rather than silently executed.

### Validation

4/4 export tests passed; node --check passed for app.js, asset-tools.js and sw.js. Current catalog and all frame paths checked locally. Documentation links, version consistency, backlog coverage, unchanged catalog and diff checks are verified before commit. Publication is verified against origin/main/tag after push; no live-host deployment claim.

### Consolidated Backlog

Statuses follow the skill: Pending, In Progress, Partially Completed, Blocked, Pending Validation, Completed, Deferred, Cancelled, Superseded. Do not delete unresolved rows in later versions. Preserve IDs/origins and update Last Updated/Resolved In when status changes. LEGACY rows preserve every original checkbox request verbatim except the superseded publication claim (full text remains archived). They are not a generation order; TASK-013 gates reconciliation.

| ID | Task | Introduced / evidence | Last Updated | Status | Priority | Resolved In |
| --- | --- | --- | --- | --- | --- | --- |
| TASK-001 | Fix <=760px portal icon covering filter button; `.portal-switches` still lacks grid-area:auto. | Unversioned UI review 2026-11-24; first versioned tracking v0.0.1 | v0.0.1 | Pending | P0 | — |
| TASK-002 | Validate visible dock blur after normal-blend fix; also inspect nested filters/chooser. | UI review; fix3266e5b4; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P0 | — |
| TASK-003 | Verify live host publishing/CDN/HTML cache; a Git push is not observed deployment. | Legacy publication request; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P1 | — |
| TASK-004 | Resume full desktop/mobile UI review: all portals, dialogs, hover swaps, empty state, native controls and six-item row. | Unversioned 2026-11-24 review; first versioned tracking v0.0.1 | v0.0.1 | Deferred | P0 | — |
| TASK-005 | Rendered/real-browser check of card clipboard permission flows, checkbox focus, bulk-pill stacking and downloads. | 691876e7 / ba5d4acc; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P1 | — |
| TASK-006 | Portable backup/restore of source PNGs, original grids, review archives and import scripts outside App Git. | Initial handoff (2369f111); first versioned tracking v0.0.1 | v0.0.1 | Pending | P1 | — |
| TASK-007 | Complete source-grid vs crop/catalog reconciliation; retain recovered originals and all approved variants. | Legacy source audit / 2026-11-19 progress; first versioned tracking v0.0.1 | v0.0.1 | Partially Completed | P1 | — |
| TASK-008 | Review art consistency only when directed; approval/import does not establish a new canonical Phanto design. | Repeated user design feedback; first versioned tracking v0.0.1 | v0.0.1 | Pending | P2 | — |
| TASK-009 | Reconcile dated near-pair review candidates with current IDs and user decisions; no automatic deduplication. | tools/REVIEW.md, 2026-11-19 evidence; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| TASK-010 | Extend repeatable asset/animation integrity tooling if needed; current export unit tests do not audit the whole library. | Initial handoff roadmap; first versioned tracking v0.0.1 | v0.0.1 | Partially Completed | P2 | — |
| TASK-011 | Exercise actual installed-service-worker offline navigation; inline fallback changed but that route was not exercised. | Offline update50fea243; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P1 | — |
| TASK-012 | Review API origin configuration if another host is requested; current absolute origin is hard-coded. | Initial handoff known limitation; first versioned tracking v0.0.1 | v0.0.1 | Deferred | P2 | — |
| TASK-013 | Reconcile every historical franchise/sheet request below before generating or calling content missing. | docs/history/PENDING-legacy.md (undated); first versioned tracking v0.0.1 | v0.0.1 | Pending | P2 | — |
| TASK-100 | Restore missing25 printer-disaster activities while preserving all existing IDs. | User follow-up 2026-11-26; first versioned tracking v0.0.1 | v0.0.1 | Completed | P1 | Pre-baseline486fc64c; recorded v0.0.1 |
| TASK-101 | Card title/JSON copy, checkboxes, ZIP/JSON bulk export and category fields: implementation plus automated validation. | 691876e7 / ba5d4acc; first versioned tracking v0.0.1 | v0.0.1 | Completed | P1 | Pre-baselineba5d4acc; recorded v0.0.1 |
| TASK-102 | Initial authoritative handoff, Phanto MUST rules and preservation of historical progress/backlog. | 2369f111 and subsequent handoff commits; first versioned tracking v0.0.1 | v0.0.1 | Completed | P1 | Pre-baseline; recorded v0.0.1 |
| TASK-103 | Remove only explicitly rejected malformed side bottle from catalog. | User explicit rejection; first versioned tracking v0.0.1 | v0.0.1 | Completed | P1 | Pre-baseline072ca2e1; recorded v0.0.1 |
| TASK-104 | Introduce versioned continuity log, consolidated persistent task IDs, changelog and synchronized version metadata. | v0.0.1 (this update); first versioned tracking v0.0.1 | v0.0.1 | Completed | P1 | v0.0.1 |
| LEGACY-001 | Lost | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-002 | House M.D. | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-003 | Friends | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-004 | Steven Universe | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-005 | The Amazing World of Gumball | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-006 | Breaking Bad | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-007 | Betty la fea | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-008 | The Sopranos | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-009 | Mad Men | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-010 | Dexter | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-011 | Fleabag | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-012 | Succession | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-013 | The Wire | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-014 | CSI | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-015 | CSI: NY | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-016 | CSI: Miami | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-017 | The Mentalist | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-018 | The Boys | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-019 | The Big Bang Theory | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-020 | Peppa Pig | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-021 | SpongeBob SquarePants | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-022 | Bluey | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-023 | Rick and Morty | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-024 | Super Mario in pairs: Mario, Luigi, Toadette, Yoshi, and Koopa Troopa. Toad, Bowser, Goomba, and Peach are already in the local catalog. Donkey Kong is listed under his own franchise. | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-025 | Game sheets: Doom, Elden Ring, Dark Souls, Assassin’s Creed, Rayman, The Witcher, Cyberpunk 2077, Fallout, and Skyrim. The existing Cyberpunk genre sheet is a separate collection. | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-026 | Separate full game sheets for Halo and Metal Gear. Sprites from the mixed Halo/Metal Gear sheet are already in the catalog. | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-027 | Pokémon expansion: complete the Gen I and Gen II rosters, plus starter lines and legendary Pokémon from every generation. This includes the remaining Nidoran family and five starter evolutions from earlier attempts. | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-028 | Anime sheets: Re:Zero, JoJo’s Bizarre Adventure, Soul Eater, Fullmetal Alchemist, Ascendance of a Bookworm, The Apothecary Diaries, Overlord, Ranma ½, Urusei Yatsura, City Hunter, and Code Geass. | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-029 | Movie sheets: update the Jurassic Park draft with varied poses. Create Back to the Future, Ghostbusters, Pirates of the Caribbean, Indiana Jones, The Matrix, Planet of the Apes, Harry Potter, Rocky/Creed, and Terminator. | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-030 | Scary-cute movie designs from Halloween, Scream, Alien, A Nightmare on Elm Street, and Hellraiser. | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-031 | Standalone Batman and Superman costumes and the planned Marvel Villains sheet. Darkish Knight is already indexed as its own costume. | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-032 | Music sheets: salsa and reggaeton. | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-033 | Screen genre sheets: musical, sitcom, reality, game show, and talk show. | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-034 | Audit older source grids against the individual crop catalog. The original 25 Muppets poses were recovered, and both Muppets sets are indexed locally. | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Pending Validation | P2 | — |
| LEGACY-035 | Historical publish-and-verify request; old3,609 IDs/ahead-behind/blocked-push claims obsolete. Remaining live verification tracked in TASK-003. | Legacy backlog, undated/unversioned; first versioned tracking v0.0.1 | v0.0.1 | Superseded | P2 | v0.0.1 → TASK-003 |

### Next Steps

1. Address TASK-001 only in an authorized implementation update, preserving the one-row/six-item dock and hover swaps.
2. Resume TASK-004 only when the user's pause is lifted; validate TASK-002/TASK-005/TASK-011 without claiming source checks are browser checks.
3. Verify production publication independently (TASK-003), and plan source backup/reconciliation (TASK-006/TASK-007).
4. Reconcile historical requests before spending image credits; retain approved variants.
5. For the next update, increment from0.0.1, prepend its full entry, carry forward unresolved IDs, update CHANGELOG/metadata, commit with version, tag and push main plus tag, then confirm local/remote equality.

---

## 1. Verified baseline and scope

- Actual Git repository: `A:/julibe/phanto/emojis/App`, remote `https://github.com/Julibe/phanto-cosplay.git`, branch `main`.
- Parent `A:/julibe/phanto/emojis` is the asset workspace, not this Git root. Source PNGs, grids and review tooling also live outside the Git repository. Back them up separately; a fresh Git clone does not contain them.
- Current implementation baseline before the versioned documentation update: `ba5d4acc` (category-aware JSON exports). Initial pre-versioning documentation audited white-glass baseline `7ee17dc5`. Local `main` and locally recorded `origin/main` matched; working tree was clean before documentation work. This is not a fresh network/hosting audit.
- Catalog verified directly from `dist/catalog.json`: **4,323 entries**, unique image IDs managed by the builder; every catalog image path and every referenced animation frame exists locally. File existence does not establish visual correctness.
- **11 animated WebPs**: 9 in Animation, 2 star animations in Assets. **37 toy-related entries** remain after one explicit rejection (18 standalone toys, 19 Phanto interactions).
- No browser was used for this audit. Latest UI edits were checked through source/build checks, not rendered cross-browser QA. Hosted deployment of the latest commit has not been verified.

| Category | Entries |
| --- | ---: |
| Activities | 839 |
| Animals | 51 |
| Animation | 9 |
| Assets | 501 |
| Costumes | 1,910 |
| Holidays | 423 |
| Powers | 25 |
| Reactions | 541 |
| Turnarounds | 24 |

Assets breakdown: Ingredients 35; Cookies 5; Stars 12; Icons 25; GUI 81; Terrain 25; Textures 200; Vegetation 100; Toys 18. These are a dated snapshot, not constants to hard-code.

## 2. Overview and vision

**Phanto's Cosplay — “Dress for any occasion.”** Julibe's spooky-cute character library lets people find, copy, download, edit and share reactions, costumes and poses. It also serves Berry character art, game props, terrain, textures, GUI kits and animations. The growing public catalog and static JSON API support reuse in other projects.

This repository is a gallery and asset distribution app. Cookie Adventure supplies themed assets and poses; a playable game or level editor is not implemented here. The nine-slice assets are downloadable game UI resources, not a new visual style for the gallery itself.

## 3. Architecture and technology

- Static HTML, CSS and vanilla browser JavaScript. No React, application server, database, authentication service or remote editing persistence in the reviewed implementation.
- `dist/` is both the served site and the editable frontend source. Do not assume all of it can be regenerated from a separate source directory. Catalogs/API, utilities and icon copies are generated; `app.js`, `style.css`, `index.html`, shader and browser helpers are maintained directly.
- Node ES modules implement catalog, path migration, release dates, animation export and API generation. Node must support the syntax used; no version is pinned in `package.json`. Git must be on PATH for release-date inference.
- Declared dev dependencies: Sharp `^0.34.5`, Tailwind CSS and CLI `^4.3.5`, Font Awesome Free `^7.3.1`; `package-lock.json` pins the resolved installation. Use `npm ci`.
- Tailwind generates utilities from `dist/index.html` through `tailwind.css`. Most styling is authored CSS. Font Awesome assets are copied locally. Bebas Neue and Comfortaa are loaded from Google Fonts in CSS.
- Browser APIs provide clipboard, sharing, canvas image transformations and PWA installation. Feature support varies; HTTPS is required for secure clipboard/file-sharing features.
- `background.js` renders the portal background with WebGL; CSS supplies fallbacks. `hero.js` controls the hero presentation. Preserve reduced-motion/forced-color handling.
- `pwa.js` registers `sw.js`. Service worker navigation is network-first with an offline reconnect response; it does **not** implement an offline asset catalog/cache.
- API is static generated JSON, not an HTTP backend. `api.mjs` uses `https://cosplay.julibe.cloud/` for absolute URLs. `.htaccess` and `_headers` supply CORS rules on supported hosts; nginx configuration is external.

## 4. Structure and responsibilities

Paths in this section are relative to the Git root unless labeled workspace.

| Path | Responsibility |
| --- | --- |
| `HANDOFF.md` | Current continuity authority, decisions, verified state and roadmap |
| `AGENTS.md` | Agent entry point requiring this handoff |
| `README.md` | Getting started, API and publishing reference |
| `docs/history/` | Preserved dated progress/backlog; historical claims are not current status |
| `dist/index.html` | Document, controls, dialogs, portal icons, six Assets shortcuts and versioned entry references |
| `dist/style.css` | Design tokens, responsive layout, white glass surfaces, portal presentation and accessibility media rules |
| `dist/app.js` | Search, filtering, rendering, URL state, portals, copying, downloads, sharing and editor |
| `dist/asset-tools.js` | Shared category-aware JSON metadata and stored ZIP/CRC32 export helpers |
| `tools/asset-tools.test.mjs` | Targeted metadata, selection, clipboard and ZIP export tests |
| `dist/hero.js`, `dist/background.js` | Hero motion and WebGL portal background |
| `dist/pwa.js`, `dist/sw.js`, `dist/manifest.webmanifest` | Installation and navigation fallback |
| `dist/catalog.js`, `dist/catalog.json` | Generated browser/global and public catalog |
| `dist/api/` | Generated API indexes, collections, categories, individual poses and aliases |
| `catalog.mjs` | Scans workspace PNGs and derives metadata from filename conventions |
| `pose-assets.mjs` | Canonical paths, migration, asset types/groups, animation merge, release assignment and versioning |
| `costume-types.mjs`, `pose-renames.json` | Franchise parsing and old-ID compatibility |
| `version-assets.mjs` | Revision query strings, catalog/API output and hashes in HTML |
| `release-dates.mjs`, `release-dates.json` | Stable release dates, inferred from Git when not recorded |
| `sprite-revisions.json` | Per-ID image cache invalidation, including animation frames |
| `animations/`, `animations.mjs` | Source PNG strips/grids, metadata and animated WebP/frame export |
| `tools/` | Earlier matching, duplicates, crop exports and detailed review evidence |
| `dist/assets/gui/nine-slice/` | Native-size bases, 54 PNG/WebP slices, manifest, CSS, previews and ZIP |
| Workspace `../squirlce/squirlce-emojis/` | Authoritative individual PNG inputs for catalog scan |
| Workspace `../squirlce/squicle-grids/collections/` | Original collection sheets; retain all variants |
| Workspace `../_to-review/` | Import scripts, crop audits, drafts, rejected art, previews and local Python packages |
| Workspace `../_to-review/toy-corrections/` | Recent approved/additional toy import sources, crops and audit files |
| Workspace `../.catalog-release/` | Separate checkout/release work area; do not assume it is current or edit it in place |

Keep the existing misspellings `squirlce` and `squicle-grids` in filesystem paths; changing them breaks existing scripts.

## 5. Implemented behavior to preserve

- Search names, franchises, emotion synonyms, keywords, emoticons and selected emoji. Multiple filters, sorting, release date ranges, shuffle and progressive gallery rendering exist.
- Pose links, legacy IDs, aliases and filtered-view URLs are supported. URL restoration handles old `category=Animated` as `Animation`. Do not change stable IDs just to change displayed names.
- Three portals: Phanto, Berry and Assets. One current illustrated portal icon is displayed; hover/focus/touch opens the pill chooser. Hover image swaps/reactions are established behavior. Do not replace this with permanently visible portal icons or remove swapping.
- Assets uses `assetType` and `assetGroup`, with type/group filtering. **Bottom Assets navigation is exactly ONE ROW of SIX items:** Ingredients, Cookies, Stars, GUI, Textures, Vegetation. Icons, Terrain and Toys remain in the filter panel. Do not add them back into the bottom row or wrap it.
- Phanto and Berry retain their existing collection shortcuts; do not apply Assets navigation changes to them.
- Card actions copy PNG, copy title, copy category-aware JSON, download WebP, share links/files and open pose tools. Checkbox selection and the >=2 selected ZIP/JSON pill are implemented; see the version log for validation limits. Editor supports still-frame selection, transforms and exports. Animated download retains WebP animation; clipboard copies a still frame.
- New badge follows the newest release batch (6-hour window relative to latest release, not simply current time). Dates and sorting are preserved through rebuilds.
- UI-kit ZIP download exists. GUI resources include 3 panels and 3 buttons in book-paper, classic-game and forest styles; manifest slice borders and original PNG dimensions are authoritative.
- Cookie Adventure story poses and Powers are Phanto content; standalone ingredients and props are Assets. Do not make a separate character portal for story or Powers.

## 6. Design guidelines and non-negotiable rules

### PHANTO DESIGN — MUST RULES (read before any artwork work)

**These are mandatory acceptance criteria, not suggestions. The user has repeatedly had to correct these same failures. Do not spend credits or import another version without checking them.**

| MUST | What to verify / what has repeatedly gone wrong |
| --- | --- |
| **1:1 BODY** | Main body width equals main body height, excluding tail, flippers, props, headphones and costume pieces. A 1:1 canvas or square crop does NOT make a tall character correct. Inspect the underlying body even when a prop covers it. Never stretch the torso to fit accessories. |
| **SQUIRCLE** | A rounded-square three-dimensional body with a broad top/base, upright sides and rounded corners. NOT a circle, sphere, egg, pear, dome or vertical rectangle. “Cute” does not justify changing the silhouette. |
| **MATTE 3D** | Keep Phanto's original soft matte dimensional finish and diffuse shading. NOT shiny, glossy, polished plastic/vinyl, wet, flat illustration, felt or a sewn cushion. Plush props may be plush; Phanto does not inherit their material. |
| **EXACTLY ONE TAIL** | Normal front-facing art has ONE tail on TOP. No second tail at the bottom, rear or side. No extra body bumps masquerading as feet or a tail. Approved historical rotation variants are preservation exceptions only; each frame still has exactly one tail. |
| **TWO EYES** | Exactly two eyes, never three. Expression changes must not leave an old eye behind. Back-facing rotation views have no face; ordinary perspective may naturally occlude a feature, not duplicate it. |
| **TWO FLIPPERS** | Two small fingerless side flippers. No human hands, fingers, legs or feet added. A flipper must not turn into a lower-body protrusion. |
| **ORIGINAL IDENTITY** | Preserve approved face, pale blush/ivory color, blush marks, proportions and distinctive features. Use the user's original Phanto reference, not an accumulating chain of rejected generated variants. A costume or interaction does not authorize a redesign. |
| **5x5 SHEET** | General sprite sheets are FIVE columns by FIVE rows, 25 square cells on a square canvas. Never silently substitute 2x3, 2x2 or a strip. Partial sheets leave unused cells empty; do not invent extra designs to fill them. Explicit user exceptions, such as Mario pairs and existing animation strips, remain exceptions. |
| **REAL TRANSPARENCY** | Check alpha, not the preview color. No painted black/white/checkerboard background, screenshot UI, haze or ground fragments. Preserve intended translucent powers without blindly thresholding them away. |
| **COMPLETE CROPS** | Keep all of each character and its props, centered with safe margins. No clipped tails/heads/objects, neighboring slivers or resizing that deforms the body. |

**Required check before presenting artwork as corrected or adding it to the app:**

1. Compare with the original approved reference, not just the prompt text. Inspect every Phanto individually at useful size.
2. Check the main body's width and height and its squircle silhouette separately. Do not count the top tail or accessories in the body bounds. Do not claim a numerical ratio was measured if it was only inspected visually.
3. Count eyes, flippers and tails; inspect the bottom and back specifically for extra tails or foot-like bumps.
4. Check matte 3D shading and original identity. “3D” in a generation prompt is not proof that the render matches Phanto.
5. Check sheet dimensions/layout, actual alpha, full silhouettes and every crop. For rotations also verify a constant main-body scale/pivot, without per-frame trimming.
6. If a rule fails, do not label the result “fixed,” “approved” or complete. State the actual issue and correct only that issue within the authorized scope. Do not repeatedly generate speculative alternatives to hide a failure.
7. Explicit user approval to import a particular existing sheet is not permission to delete older variants, redesign props, or use that imperfect sheet as the new canonical Phanto reference. Preserve the approved import while keeping these rules for future work.

**Repeated failure pattern to avoid:** round body → tall rectangle → shiny plastic → extra tail → wrong grid → unnecessary regeneration. Fixing one property must not break another. Keep the full checklist active on every revision, including monkey, puppy, car, bottle, VR and power interactions.

### App interface

Latest explicit direction: **ALL UI surfaces are white with opacity and backdrop blur. Nothing should be a dark panel.** This applies to cards, dock, filters, portal chooser, dialogs, inputs, hover/selected states and scrollbar styling. Colored animated page backgrounds remain; a tinted scene behind white glass is not permission to add dark or opaque colored surface fills.

**BACKDROP BLUR IS A MUST.** Do not remove, disable or visually cancel it while changing tint, opacity, hover states or nesting. On the dock's blur-carrying pseudo-element use normal blending, not `soft-light`: blending the original sharp backdrop back in defeats the blur. Preserve the prefixed and unprefixed backdrop-filter declarations and verify visible blur before claiming visual completion. The 2026-11-25 dock fix changes that layer to normal blending with a faint white gradient; code verification alone is not a fresh rendered check.

Current tokens in `dist/style.css`: `--surface: #ffffff1f`, `--glass-tint: #ffffff12`, `--glass-deep: #ffffff22`, `--glass-glint: #ffffff19`, `--line: #ffffff35`, `--ink: #ffffffeb`, `--muted: #ffffffc4`, `--accent: #ffffffe6`, `--glass-blur: blur(56px) saturate(160%)`. Selected categories use translucent white `#ffffff3d`. These values are implementation, not a reason to ignore later feedback.

Display type: Bebas Neue. UI/body: Comfortaa. Preserve rounded cards, pill dock, illustrated portal icons and existing motion. The <=760px layout moves the search and shortcuts into their established mobile arrangement; the category shortcuts themselves still form one six-item row.

The dock's blur was moved to `.search-dock::before` so the parent does not establish a backdrop root that prevents nested popovers from blurring. Do not restore blur to the ancestor without checking the effect on filters and portal chooser. Native select options use a white background and gray text for readability; browser-native popups cannot be assumed to render custom transparency.

### Phanto artwork

1. **Main body is a 1:1 SQUIRCLE**: rounded-square volume, broad top/base, upright sides, rounded corners. Body width equals height excluding tail, flippers and props. A square canvas does not prove the body is square.
2. **Soft MATTE 3D**, with dimensional diffuse shading. Not a flat illustration, shiny plastic/vinyl, felt/sewn pillow, sphere, egg or tall rectangle.
3. **Exactly ONE tail.** In normal front-facing art it is on TOP. No extra rear/lower tail or foot-like bumps. Exactly two eyes and two small fingerless flippers; inspect for hallucinated anatomy.
4. Approved legacy rotation sets explicitly include top-only, bottom-only and mixed tail patterns. Preserve all six Phanto sets; this exception does not authorize multiple tails in one frame or deleting a set.
5. General sheets are **5x5**, 25 square cells on a square canvas. Partial sheets may leave unused cells empty. Mario requests were explicitly in pairs; do not assume general sheets are 2x3 or 2x2.
6. Preserve the exact approved character reference; don't repeatedly use a rejected generated sheet as the next identity reference. Check each body silhouette, material, eyes and tail count before calling it corrected.
7. Transparent means real alpha, not black/white/checkerboard paint or translucent background haze. Dynamic poses still respect body geometry.

Toy specifics: use the cuter black puppy with larger head, shorter muzzle, erect ears and purple collar. Dog printed on the red package is a tan-and-black German Shepherd. Monkey is the cute simple-faced astronaut plush with white/lilac suit and mint headphones, not a realistic ape. Car is the supplied silver Hyundai Ioniq 5 silhouette, not a generic SUV. Red bottle has two rounded sections, a narrow black waist band and black cap; no text/logos; user requested a slimmer silhouette. Blue geometry is thin-line VR hologram art, not a chunky physical frame.

### Preservation and approval

- Never delete or skip a pose because it looks repetitive. Keep all approved variants unless the user explicitly names a removal. Similarity reports are evidence for review, not deletion authority.
- Explicitly rejected `asset-toys-bottle-side` was removed in `072ca2e1`. Its archived source is outside the scanned PNG directory. Do not re-import it from an old sheet.
- Preserve hover image swaps, portal chooser, existing icons, navigation, filters, editor, sharing and links. Do not redesign unrelated surfaces to solve a small issue.
- User has prohibited browser/computer-use spending for routine work. Use local code/files and deterministic checks; obtain a changed instruction before interactive browser use. Do not claim browser QA when none occurred.
- Image credits are sensitive. Do not generate during imports, maintenance or documentation. Generation requires a current art request; imports use approved files. Do not launch repeated speculative generations or silently expand requested counts.
- Do not add strawberries to sheets when the user has excluded them. Berry retains its separate portal and approved assets.
- Communicate in English. Be concise and direct; carry out authorized work without repetitive confirmation. Never claim a result is correct solely because the prompt requested it.

## 7. Asset pipeline and specifications

IDs are lowercase hyphenated slugs. Canonical PNG filenames supply IDs. Source scan excludes `meme-*` and `cosplay-memes-*`; approved meme replacements/aliases are intentional. Never rescan an old directory to republish excluded files.

| Kind | Naming/path rule |
| --- | --- |
| Reactions | `emoji-<group>-<action>` |
| Activities | `emoji-activity-<action>`; toy interactions use `emoji-activity-toys-...` |
| Costume franchises | `game-`, `anime-`, `tv-`, `movie-`, `comics-`, `book-` + franchise/character/action |
| Standalone costumes/animals/holidays | `costume-`, `animal-`, `holiday-` |
| Story | ID `emoji-activity-cookie-adventure-<level>-<pose>`; served `game/cookie-adventure/<intro|level1..6|final|ending>/<pose>.webp`; omit Cookie Adventure from displayed pose title |
| Assets | ID `asset-<type>-<group>-<name>`; served `assets/<type>/<category>/<name>.webp`; derive `assetType`/`assetGroup` through `pose-assets.mjs` |
| Toys | Standalone `asset-toys-<monkey|puppy|vr|car|bottle>-...`; interactions remain Activities |
| Animation | `animated-<slug>`, normally `animated/<id>.webp`; asset animations can configure `assets/...` output |

Normal sprites: transparent RGBA square PNGs, typically 1024x1024, centered with safe margins. Runtime gallery WebPs are normally 320x320. Historical exports fit art to 840px within 1024; recent toy exports use 880px. Older quality88 and recent quality92 encodes both exist; do not re-encode the whole library to make them uniform. Native nine-slice resources deliberately retain their own source sizes; do not substitute gallery thumbnails for those.

Crop by complete subject/component, not a blind fixed rectangle. 1254px sheets do not divide evenly by five; determine bounds carefully. Whole-sheet connected components can recover props crossing a cell boundary. Inspect every export for clipping, neighboring slivers, missing disconnected props and alpha damage. Threshold160 used in recent toy scripts is specific to those sheets' haze; do not apply it blindly to semitransparent powers/glass/VR art.

Recent scripts and evidence: workspace `_to-review/toy-corrections/import-approved.py`, `import-additional.py`, `approved/audit.json`, `additional/audit.json`, and their previews. These are not checked into App. Do not regenerate artwork to repair a deterministic crop.

### Animation requirements

`animations/animations.json` configures columns, rows, frame count, fps, `preserveCanvas` and optional `assetPath`. Current sets:

- Idle and Celebrate: 8 frames each, 10 FPS.
- Six Phanto rotations (3 tail patterns x closed/open eyes) plus Berry: 24 frames each, 10 FPS, 2.4-second infinite loops. 5x5 input grids; duplicate frame25 excluded.
- Gold and purple star half-turns: 12 frames each, 10 FPS, 180 degrees, Assets/Stars. Do not convert them to 25-frame full turns.
- Align rotation scale/pivot using the **main body**, excluding tail/flippers. `preserveCanvas: true` prevents exporter trimming; preserve full aligned 320px cells. Independent frame trimming/scaling makes the tail change body size and causes jumping.
- Animated WebP plus individual WebP frames are exported. `withAnimations()` merges metadata back during catalog rebuilds and removes previous animation entries before replacing them. Assets animations keep Assets category.

## 8. Development workflow

Run commands from App unless otherwise stated:

```powershell
npm ci
python -m http.server 8765 --bind 127.0.0.1 --directory dist
```

Server command is available for local development; opening a browser remains subject to the user's no-browser instruction.

| Change | Command/action |
| --- | --- |
| CSS/HTML/JS only | Edit `dist/` source, then `node version-assets.mjs` for hash references/API |
| Tailwind classes/icons/dependencies | `npm run build` (icons + Tailwind + versioning; does not scan new PNGs) |
| New sprites | Save source PNGs in workspace source directory and matching WebPs in `dist/poses/`, then `node catalog.mjs` |
| Existing metadata/path migration | `node pose-assets.mjs` organizes existing catalog and versions output |
| One animation | `node animations.mjs <slug>`; keep unrelated animations intact |
| All animations | `npm run build:animations` only when the full export is intended |
| API only | `node api.mjs` |
| Changed image under same ID | Update `sprite-revisions.json`, then version/rebuild |

`catalog.mjs` is source-driven: missing source PNGs can remove library entries. Fresh clones must not run it until the sibling source library has been restored and audited. `api.mjs` removes/rebuilds `dist/api/` internally; do not delete folders manually to “clean up.” `version-assets.mjs` regenerates thousands of API files and can take tens of seconds or longer on A:. Wait for completion before staging or starting another builder.

Maintain UTF-8. PowerShell 5.1 `Get-Content`/`Set-Content` can corrupt accented names; use explicit UTF-8 or `apply_patch`/Python/Node. Do not replace app state with hard-coded catalog arrays. Extend filename/type/path handling consistently in catalog builder, organizer and filter UI when adding a new type.

Verification should match the change: JS `node --check`, JSON parsing, `git diff --check`, catalog count/ID delta against HEAD, all image/frame paths resolving, aliases retaining targets, visual crop previews on a contrasting background. Use Sharp/Pillow to inspect actual dimensions, alpha and animation timing. Source/metadata checks are not browser rendering checks. Targeted export tests are available via `npm run test:asset-tools`; no full-app automated UI/CI suite is configured in the reviewed tracked configuration.

Use `rg` for searches; inspect changes before committing. Avoid noisy CRLF warnings with `2>$null` for routine Git reads; don't suppress errors when investigating a failure. No need to broaden testing indefinitely for small reversible changes.

## 9. Known issues and limits

- Offline fallback (`dist/sw.js`) now uses the app's animated colored backdrop with a translucent white glass card, white-opacity text and a white pill link; reconnect behavior (network-first navigation, 503, `no-store`, `./` link) is unchanged. Checked with `node --check` and a headless render of the inline HTML at desktop and mobile widths only; an actual offline navigation through an installed service worker was not exercised.
- Recent white glass and dock blur-layer changes are implemented but need authorized rendered desktop/mobile verification. Native browser controls and stacking/backdrop-root behavior may vary. Do not claim universal visual validation.
- Approved older sprites still have inconsistent Phanto body shapes/materials. Inclusion in the app is not proof they meet today's art rules. Preserve them unless specifically asked to correct/remove them. Current toy crops derive from user-approved sheets, including unusual preexisting package/bottle details.
- No complete fresh all-sheet/crop reconciliation or up-to-date duplicate audit was performed in this handoff. Historical review files contain decisions and unresolved candidates; never automatically deduplicate.
- Production deployment mechanism is not present in the reviewed tracked configuration. Git push was verified in prior work; live host/CDN state was not. Static server cache behavior must be checked separately when authorized.
- Source PNGs, original grids, much review tooling and archived rejected files are external to App Git; portable restoration is incomplete without that workspace.
- Native UI-kit scaling metadata/previews exist; no playable game UI integration or in-app level editor is verified.
- API origin is hard-coded. Hosting a copy elsewhere requires intentional URL/config decisions; relative image paths are supplied for consumers.
- Near-pair review records are dated. `tools/REVIEW.md` includes kept/moved decisions; old “35 near pairs” totals should not be treated as a current deletion queue.
- There is no global generation pause in effect as a current factual status; historical pause requests were followed by explicit art requests. This does not authorize unsolicited generation.

## 10. Roadmap (not claims of completion)

| Priority | Work | Complexity / acceptance |
| --- | --- | --- |
| P0 | Authorized UI regression review (started 2026-11-24, paused by user) | Medium; all portals, nested blur, native controls, one row/six shortcuts, mobile, hover swaps, sharing/editor. Approved; use GitHub `main`, headless Playwright in the cloud is fine. Partial headless pass found two bugs: (1) **Phone (<=760px): Phanto portal icon covers the filter button**, so taps hit the portal. Cause: `.portal-switches` keeps desktop `grid-column: 2` inside a one-column dock, so its absolute containing block is a ~5px implicit area at the right edge. Candidate fix: add `grid-area: auto` to the `@media (max-width: 760px) .portal-switches` rule; verified to center it above the dock. (2) **Dock blur barely visible**: `.search-dock::before` carries both the backdrop blur and `mix-blend-mode: soft-light`, which composites the sharp backdrop back in, so card text/icons read through the dock. Implemented 2026-11-25: `mix-blend-mode: normal` plus a fainter white gradient on that pseudo-element. Source/build checks passed; fresh rendered verification remains pending. Confirmed in the same pass: Assets bottom row is exactly six items in one row at desktop and phone. Still to check: filters, portal chooser, share/editor/view-link dialogs, Berry and Assets screens, empty state |
| P1 | Crop/source-to-catalog reconciliation | Large; compare all grids, preserve every approved duplicate/variant, export only missing cells and inspect previews |
| P1 | Source-library backup/portability | Medium; document or package complete source restore without changing existing paths |
| P1 | Live release verification | Medium; establish actual host publishing path and cache checks; never infer deployment from push |
| P2 | Art consistency corrections | Large and credit-sensitive; only with specific user direction, use original reference and review before importing |
| P2 | Historical franchise backlog | Large; reconcile `docs/history/PENDING-legacy.md` against current IDs before choosing tasks or generating |
| P2 | Expand useful asset/animation tooling | Medium; consider repeatable integrity checks/crop audits when needed, preserve export invariants |

Historical requested backlog includes separate 5x5 TV franchise sheets, Mario pairs, game/anime/movie expansions, Pokémon roster expansion, music and genre sheets. Full exact requests remain in `docs/history/PENDING-legacy.md`. Those unchecked tasks are **unreconciled historical requests**, not verified missing content. Mixed TV and other franchise content already exists; don't recreate it blindly. The old “3,609 IDs / 262 unpublished / ahead4 behind7 / push blocked” passage is obsolete.

## 11. Git, publishing and recovery

- **Current skill workflow (v0.0.1): work exclusively on main; do not create/switch branches or create PRs.** Update HANDOFF.md and CHANGELOG.md before each push, increment the version, synchronize package/root lock metadata, use a versioned commit and create/push its matching version tag. Local main and origin/main must match after publication. Existing backup branches are retained, not used for new work. No deployment workflow was found in tracked files; push is not proof of deployment.
- **Commit authorship (user rule, 2026-11-25):** the author and committer of every commit is the user who asked for the work, here **Julibe** (`git config user.name Julibe`, `git config user.email mail@julibe.com`), never Claude or another agent. Do not add `Co-Authored-By: Claude`, `Claude-Session` or any other agent attribution trailers to commit messages, and do not push commits authored as `Claude <noreply@anthropic.com>`. Set the git identity before the first commit of every session.
- 2026-11-25: with Julibe's approval, `main` history was rewritten so earlier Claude-authored commits are authored by Julibe and agent trailers were removed. All commit hashes changed; hashes in this file were remapped. Old clones (e.g. `App\` on Julibe's PC) must run `git fetch origin && git reset --hard origin/main` after saving any local work.
- Start with status/log and read this handoff. Preserve unrelated work. Do not create a branch/worktree under the current main-only skill workflow; keep changes scoped and preserve unrelated work. Keep commits scoped; use problem/result-focused messages.
- Before publishing, inspect ID delta and all generated assets, commit a coherent complete `dist/` with matching catalogs, API, hashes, images and metadata. Never stage during a running generator.
- **Local and GitHub always identical (user rule, 2026-11-25):** Julibe's local clone `A:/julibe/phanto/emojis/App` and GitHub `main` must match. Before starting work, commit and push any local changes in the App folder (or fetch and fast-forward it) so nothing exists only locally. After every push from any other clone (cloud or another machine), also sync the local App folder: `git fetch origin && git pull --ff-only origin main` (after a history rewrite: back up, then `git reset --hard origin/main`). Report whether the local folder ended up identical to `origin/main`.
- 2026-11-25: local App folder synced to the rewritten `origin/main`; old local `main` (tree identical to the rewritten history, no uncommitted work) kept as local branch `backup/pre-rewrite-2026-11-25`.
- Current workflow: `git fetch origin --tags`, `git pull --ff-only origin main`, then versioned commit/tag and `git push origin main <version-tag>`. If fast-forward fails, inspect and integrate without losing work; do not force/reset. Earlier merge-based synchronization is historical. Check result, not just command invocation. Never force-push or reset someone else's work to resolve routine conflicts.
- Static deployment: serve the complete `dist/` over HTTPS with asset paths preserved. Host is documented as `https://cosplay.julibe.cloud/`. Revalidate HTML so it references matching hashed JS/CSS/catalog; purge stale HTML cache once after migrations when access is authorized.
- Push success means remote Git updated, not live deployment observed. Report those separately. Sandbox/network escalation may be needed for Git; if automatic review rejects an action, explain its actual reason and don't pretend it succeeded.
- Rejected/removed PNGs must be moved outside the scanned source path before catalog rebuild, or they will return. Keep review archives and aliases when appropriate; never mass-delete sources or drafts.

## 12. Recent change history

| Commit | Result / reason |
| --- | --- |
| `a0c2e030` | Main-body rotation alignment, duplicate frame25 removed; avoids scale jumps caused by tail bounds |
| `c11cf760` | Retained six Phanto rotation variants and added transparent Berry rotation |
| `f9048636` | Category renamed Animation with old-link compatibility |
| `d45dfd69` | Asset types and season/group filters |
| `92e57bee` | 12-frame gold/purple star half-turn assets |
| `961016a4` | Corrected game icons, paper textures, six scalable UI kits |
| `2ce2b014` | 30 approved toy designs; visible Assets navigation and Toys metadata support |
| `0eeb86b4` | Eight additional corrected toy variants, preserving earlier designs |
| `072ca2e1` | User explicitly removed malformed side bottle; exactly one catalog item removed |
| `e8014835` | Removed extra Toys shortcut after dock grew too tall |
| `0608e640` | Restored one row with six Assets shortcuts; Icons/Terrain/Toys stay in filters |
| `4dc750fd` | Interim lighter colored filter panel; **superseded** by all-white surface direction |
| `7ee17dc5` | White/opacity surfaces throughout main UI, lighter backdrop/scrollbars/native controls, dock blur on pseudo-layer; offline HTML omission remains |
| `2369f111` | HANDOFF.md, AGENTS.md, `docs/history/` committed; README/PROGRESS point here |
| `50fea243` | Offline fallback page moved to animated backdrop + white glass; P0 roadmap item closed |

No exact historical commit or count should override present files. This document was created after these changes; future authors add their own significant changes and verification.

## 13. Instructions for the next agent

1. Read this handoff, status/log, affected code and the user's latest request. Do not infer a new art generation or cleanup task from an old unchecked note.
2. Identify the smallest authorized change. Preserve user decisions, assets, behavior, stable IDs and aliases. Ask only for information genuinely needed; do not ask permission again for already authorized routine work.
3. For art, lock identity to the original reference and verify body ratio, squircle, matte 3D, one tail, two eyes/flippers, 5x5 and real alpha. Don't use prose promises as QA. Avoid burning credits on iterations of an already incorrect reference.
4. For imports, first find existing generated/source files. Crop deterministically, inspect every piece, add variants rather than overwrite, then build once and validate exact count/ID changes.
5. For UI, keep all surfaces translucent white with blur and the bottom Assets menu one row/six. Preserve portal hover swapping and pill selection. No unrelated redesign.
6. Finish authorized work, verify what can actually be verified, report limitations candidly, and distinguish source changes, Git push and live deployment.
7. **Update HANDOFF.md after significant implementation**, including counts, verification, decisions, known issues and commit history. Keep README as a quick start and archives as history; do not create competing status files.

## Documentation consolidation

- `CHANGELOG.md`: versioned release history; detailed task continuity remains here.
- `docs/history/HANDOFF-pre-versioning-2026-11-26.md`: full pre-versioning handoff snapshot preserved.
- `README.md`: operational/API reference, updated alongside this handoff to remove obsolete source path and Animated-category instructions.
- `animations/README.md`: specialized rotation constraints, subordinate to this handoff.
- `tools/REVIEW.md`: historical item-level review evidence, intentionally retained.
- `docs/history/PROGRESS-2026-11-19.md`: original maintenance snapshot preserved verbatim.
- `docs/history/PENDING-legacy.md`: original workspace backlog preserved verbatim; old publication/count claims superseded.
- `PROGRESS.md` and workspace `../PENDING.md` now point here. Workspace `../HANDOFF.md` routes to this Git-root file.

## 2026-11-25: approved paper and printer-success import

- Imported the two explicitly approved 5x5 sheets: 25 paper-only poses (12 positive, 12 negative, neutral sorting center) and 25 printer-success poses. Both are Activities.
- Stable IDs: `emoji-activity-paper-*` and `emoji-activity-printer-success-*`; gallery paths under `dist/emoji/activity/`. Added 50 entries, preserved every prior ID. Current catalog: 4,298; Activities: 814.
- Source sheets and repeatable component extraction script/audit/previews are in workspace `../_to-review/printer-paper/`; import script `import-approved.py`, exports `approved-import/`. 1024px transparent PNG sources and 320px WebPs; alpha threshold used only for these approved sheets' haze. Both contact sheets visually inspected for clipped subjects/neighbor fragments; all catalog/frame paths checked locally. No fresh browser/live-host verification.
- Printer-disaster drafts remain review-only and were NOT imported by this approval. No new artwork was generated during import.

## 2026-11-26: missing printer-disaster sheet imported

- User expected the broken-printer sheet too. The previous approval was interpreted too narrowly as only the final two sheets; that omission is now corrected.
- Added all25 poses from workspace `_to-review/printer-paper/phanto-printer-disasters-reference-revision-5x5.png` as `emoji-activity-printer-disaster-*` in Activities. All earlier poses remain. This supersedes the preceding review-only status for this specific disaster sheet.
- Repeatable extraction: workspace `_to-review/printer-paper/import-disasters.py`; crops, audit and inspected contact sheet in `disaster-import/`. No new image generation. Catalog now4,323; Activities839. All catalog images and animation frames checked for file existence; no live-browser deployment claim.

## 2026-11-26: card text copy and bulk selection exports

- Every gallery card now has **Copy title** and **Copy JSON** controls alongside existing edit/download/share actions. Clipboard JSON is `{ "name": "Pose title", "imageUrl": "absolute image URL", "category": "Activities" }`, using the current document base and exact catalog path, including image revision query. Animated entries reference the animated WebP. Secure clipboard availability/permission errors are reported. Image-click copy remains unchanged.
- Styled native checkboxes select cards. Selection is an in-memory Map keyed by stable pose ID and survives search/filter/portal/pagination rebuilds; reload clears selection. It is not saved to URL or local storage. Checkboxes have accessible labels, visible focus and selected-card styling. New badges move right to avoid overlap.
- At two or more selected poses, a separate white-opacity, backdrop-blurred pill above the dock offers ZIP and JSON downloads, selection count and clear selection. Existing bottom shortcuts remain one row/six. Filters and portal chooser are offset while bulk controls are visible. Small-screen/rendered stacking still needs authorized visual review.
- Bulk JSON is an array of the same metadata objects, including `category` and optional `assetType`/`assetGroup` for Assets. ZIP includes original selected WebPs named by stable ID, retaining animated bytes. Exports snapshot selection, fetch at most four images concurrently, report progress/failures, refuse over500MB, and never intentionally download a partial ZIP after an image fails. Selection remains after export for reuse. No backend or dependency added.
- New `dist/asset-tools.js` provides metadata and a stored/uncompressed UTF-8 ZIP writer with CRC32 and classic ZIP size guards. Loaded before app.js; `version-assets.mjs` includes its cache hash. WebPs are already compressed. Browser-held selection/files mean bulk export is memory-bound.
- Run `npm run test:asset-tools` (`tools/asset-tools.test.mjs`). Tests cover URL metadata, ZIP headers/CRC/offsets/payloads, two-selection threshold, clipboard, JSON, ZIP success and failure without partial downloads. Independent Python ZIP readback passed CRC and byte equality for one real still and one animated WebP. JS syntax checked. No fresh browser or live-host visual verification.
- Catalog/artwork unchanged:4,323 entries. No generation or asset removal.

- Follow-up: both single-card clipboard JSON and bulk JSON include the catalog category; Assets also include assetType and assetGroup when present. The shared helper keeps both formats identical; category and asset-group export tests pass.
