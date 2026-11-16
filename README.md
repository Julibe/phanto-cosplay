# Phanto’s Closet

Dress for any occasion.

A spooky-cute picker for Phanto’s reactions, costumes, and poses. Search names, characters, franchises, emotions, or keyboard emoticons such as `:-)`, `<3`, and `xD`.

## Run locally

From this folder, run `python -m http.server 8765 --bind 127.0.0.1 --directory dist` and open [localhost:8765](http://localhost:8765).

The site runs from checked-in static assets. After editing Tailwind classes or updating Font Awesome, run `npm ci` and `npm run build`. Publish the contents of `dist/` on an HTTPS static host to use it from desktop and Android. Downloads and native file sharing use WebP. Click an image to copy it in the browser’s PNG clipboard format. Network sharing buttons send pose links, and compatible devices can share the WebP file via their installed apps. Pose links follow the host’s visibility settings.

## Update the catalog

The bundled WebPs are resized from the individually named source poses in the sibling `c/` directory. Keep the slug and place the converted WebP in `dist/poses/`, then run `node catalog.mjs` from this folder to regenerate the catalog from the source filenames.

Artwork and character by Julibe.
