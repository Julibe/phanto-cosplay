# Phanto project handoff

**Single source of truth for project continuity. Last reviewed: 2026-11-24 (America/Bogota); offline fallback update same day.**

Every AI agent must read this file before changing the project and update it after significant implementation. The user's current instructions override this document. Specialized reference documents explain mechanisms; they do not override the decisions here.

## 1. Verified baseline and scope

- Actual Git repository: `A:/julibe/phanto/emojis/App`, remote `https://github.com/Julibe/phanto-cosplay.git`, branch `main`.
- Parent `A:/julibe/phanto/emojis` is the asset workspace, not this Git root. Source PNGs, grids and review tooling also live outside the Git repository. Back them up separately; a fresh Git clone does not contain them.
- Implementation baseline before this documentation update: `bad91335` (white glass surfaces). Local `main` and locally recorded `origin/main` matched; working tree was clean before documentation work. This is not a fresh network/hosting audit.
- Catalog verified directly from `dist/catalog.json`: **4,248 entries**, unique image IDs managed by the builder; every catalog image path and every referenced animation frame exists locally. File existence does not establish visual correctness.
- **11 animated WebPs**: 9 in Animation, 2 star animations in Assets. **37 toy-related entries** remain after one explicit rejection (18 standalone toys, 19 Phanto interactions).
- No browser was used for this audit. Latest UI edits were checked through source/build checks, not rendered cross-browser QA. Hosted deployment of the latest commit has not been verified.

| Category | Entries |
| --- | ---: |
| Activities | 764 |
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
- Card actions copy PNG, download WebP, share links/files and open pose tools. Editor supports still-frame selection, transforms and exports. Animated download retains WebP animation; clipboard copies a still frame.
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
- Explicitly rejected `asset-toys-bottle-side` was removed in `fab60d59`. Its archived source is outside the scanned PNG directory. Do not re-import it from an old sheet.
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

Verification should match the change: JS `node --check`, JSON parsing, `git diff --check`, catalog count/ID delta against HEAD, all image/frame paths resolving, aliases retaining targets, visual crop previews on a contrasting background. Use Sharp/Pillow to inspect actual dimensions, alpha and animation timing. Source/metadata checks are not browser rendering checks. There is no configured automated test runner or CI test suite in package.json/reviewed tracked configuration.

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
| P0 | Authorized UI regression review | Medium; all portals, nested blur, native controls, one row/six shortcuts, mobile, hover swaps, sharing/editor |
| P1 | Crop/source-to-catalog reconciliation | Large; compare all grids, preserve every approved duplicate/variant, export only missing cells and inspect previews |
| P1 | Source-library backup/portability | Medium; document or package complete source restore without changing existing paths |
| P1 | Live release verification | Medium; establish actual host publishing path and cache checks; never infer deployment from push |
| P2 | Art consistency corrections | Large and credit-sensitive; only with specific user direction, use original reference and review before importing |
| P2 | Historical franchise backlog | Large; reconcile `docs/history/PENDING-legacy.md` against current IDs before choosing tasks or generating |
| P2 | Expand useful asset/animation tooling | Medium; consider repeatable integrity checks/crop audits when needed, preserve export invariants |

Historical requested backlog includes separate 5x5 TV franchise sheets, Mario pairs, game/anime/movie expansions, Pokémon roster expansion, music and genre sheets. Full exact requests remain in `docs/history/PENDING-legacy.md`. Those unchecked tasks are **unreconciled historical requests**, not verified missing content. Mixed TV and other franchise content already exists; don't recreate it blindly. The old “3,609 IDs / 262 unpublished / ahead4 behind7 / push blocked” passage is obsolete.

## 11. Git, publishing and recovery

- At audit only local `main` was listed, tracking `origin/main`. Recent work was committed directly to main and pushed with user authorization. No required PR template, protected-branch policy or automated deployment workflow was found in tracked files. Future sessions must honor current repository/user policy rather than assume a new branch is forbidden or direct push is always authorized.
- Start with status/log and read this handoff. Preserve unrelated work. For multi-step or risky work use a focused branch/worktree when appropriate. Keep commits scoped; use problem/result-focused messages.
- Before publishing, inspect ID delta and all generated assets, commit a coherent complete `dist/` with matching catalogs, API, hashes, images and metadata. Never stage during a running generator.
- Prior authorized workflow: `git pull --no-rebase origin main`, resolve without losing remote work, then `git push origin main`. Check result, not just command invocation. Never force-push or reset someone else's work to resolve routine conflicts.
- Static deployment: serve the complete `dist/` over HTTPS with asset paths preserved. Host is documented as `https://cosplay.julibe.cloud/`. Revalidate HTML so it references matching hashed JS/CSS/catalog; purge stale HTML cache once after migrations when access is authorized.
- Push success means remote Git updated, not live deployment observed. Report those separately. Sandbox/network escalation may be needed for Git; if automatic review rejects an action, explain its actual reason and don't pretend it succeeded.
- Rejected/removed PNGs must be moved outside the scanned source path before catalog rebuild, or they will return. Keep review archives and aliases when appropriate; never mass-delete sources or drafts.

## 12. Recent change history

| Commit | Result / reason |
| --- | --- |
| `abb9c66c` | Main-body rotation alignment, duplicate frame25 removed; avoids scale jumps caused by tail bounds |
| `d26ad58c` | Retained six Phanto rotation variants and added transparent Berry rotation |
| `59bc2e6b` | Category renamed Animation with old-link compatibility |
| `3433cede` | Asset types and season/group filters |
| `f095a37c` | 12-frame gold/purple star half-turn assets |
| `41d79f73` | Corrected game icons, paper textures, six scalable UI kits |
| `fa42211d` | 30 approved toy designs; visible Assets navigation and Toys metadata support |
| `448a6ab7` | Eight additional corrected toy variants, preserving earlier designs |
| `fab60d59` | User explicitly removed malformed side bottle; exactly one catalog item removed |
| `9fceff5a` | Removed extra Toys shortcut after dock grew too tall |
| `1713ae62` | Restored one row with six Assets shortcuts; Icons/Terrain/Toys stay in filters |
| `58524ad0` | Interim lighter colored filter panel; **superseded** by all-white surface direction |
| `bad91335` | White/opacity surfaces throughout main UI, lighter backdrop/scrollbars/native controls, dock blur on pseudo-layer; offline HTML omission remains |
| `1fbfa3b1` | HANDOFF.md, AGENTS.md, `docs/history/` committed; README/PROGRESS point here |
| `00c129c3` | Offline fallback page moved to animated backdrop + white glass; P0 roadmap item closed |

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

- `README.md`: operational/API reference, updated alongside this handoff to remove obsolete source path and Animated-category instructions.
- `animations/README.md`: specialized rotation constraints, subordinate to this handoff.
- `tools/REVIEW.md`: historical item-level review evidence, intentionally retained.
- `docs/history/PROGRESS-2026-11-19.md`: original maintenance snapshot preserved verbatim.
- `docs/history/PENDING-legacy.md`: original workspace backlog preserved verbatim; old publication/count claims superseded.
- `PROGRESS.md` and workspace `../PENDING.md` now point here. Workspace `../HANDOFF.md` routes to this Git-root file.
