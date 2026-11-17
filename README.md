# Phanto’s Cosplay

Dress for any occasion.

A spooky-cute picker for Phanto’s reactions, costumes, and poses. Search names, characters, franchises, emotions, or keyboard emoticons such as `:-)`, `<3`, and `xD`.

## Run locally

From this folder, run `python -m http.server 8765 --bind 127.0.0.1 --directory dist` and open [localhost:8765](http://localhost:8765).

## Host on your own server

Serve `dist/` as the site root, or upload its contents to a subdirectory. Keep the asset folders beside `index.html`. The files are ready to serve over HTTPS from any static web server. HTTPS enables image clipboard and browser file sharing on supported devices.

After editing Tailwind classes or updating Font Awesome, run `npm ci` and `npm run build` to regenerate the static assets.

Downloads and native file sharing use WebP. Copy puts the image on the clipboard as PNG. Social buttons share pose links on the server where the app is running.

## Share links

On your server at `https://cosplay.julibe.cloud/`, search and filters are encoded in the URL. Use the link button beside the pose count to copy the current view. For example, `/?q=happy&category=Reactions` opens a filtered search, and `/?pose=emoji-joy-cheerful` opens a single pose. The share menu on a costume also offers a character link.

## Install and connect

On HTTPS, use the browser’s **Install app** or **Add to Home Screen** command. Supported browsers may also show an install button in the header. The gallery loads from the server, and offline mode shows a reconnect screen.

`GET /catalog.json` returns the public pose catalog as JSON with `schemaVersion` and `poses`. Each pose has an ID, name, category, and an image `path` relative to the catalog URL. Optional fields include emotion, franchise, and legacy IDs. If a browser app reads the feed from a different origin, configure CORS for `catalog.json` on your server.

## Update the catalog

Save the individual PNG sprites in the sibling `squirlce-emojis/` directory. Put each newly converted WebP in `dist/poses/` with the same filename stem, then run `node catalog.mjs` to regenerate the catalog and move the assets into their prefix folders.

For example, `game-persona-5-joker-posing.webp` is served at `/game/persona-5/game-persona-5-joker-posing.webp`, and `emoji-anxiety-worried.webp` is served at `/emoji/anxiety/emoji-anxiety-worried.webp`. The catalog records each image path. Shared `?pose=` links use IDs and continue to work across file moves.

Publish the complete `dist/` from one commit. Revalidate `index.html` on requests so it can load the matching versioned catalog and scripts. When switching from a previously deployed layout, purge the old HTML cache once.

Use these filename patterns for new sprites.

- Holidays use `holiday-<holiday>-<action>`.
- Anime and TV use `anime-<series>-<character>-<action>` and `tv-<series>-<character>-<action>`.
- Movies, games, comics, and books use their type as the first segment, followed by the franchise, character, and action.
- Music uses `music-<genre>-<action>`. Film and TV genre sprites use `movie-<genre>-<action>` or `tv-<genre>-<action>`.
- Cyberpunk genre sprites use `genre-cyberpunk-<character>-<action>`.
- Standalone costumes, animals, and memes use `costume-`, `animal-`, and `meme-`.
- General reactions use `emoji-<category>-<emotion>`.

When renaming an existing sprite, record the old stem under the new stem in `pose-renames.json` so old shared links still resolve.

Artwork and character by Julibe.
