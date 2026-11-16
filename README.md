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

## Update the catalog

Save the individual PNG sprites in the sibling `squirlce-emojis/` directory. Put each converted WebP in `dist/poses/` with the same filename stem, then run `node catalog.mjs` to regenerate the catalog.

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
