# Phanto animation rules

- Phanto has exactly one tail. In a front-facing pose, that tail is the pointed curl at the TOP of the head.
- Preserve the top tail as the character rotates. Do not add a lower rear tail, bottom nub, feet, or another tail.
- Keep the compact cream/pink squircle body, two eyes, blush, mouth, and two small fingerless flippers consistent.
- Rotation test: `rotation-360.png` is a 5 by 5 sheet of 25 aligned frames in row-major order, configured at 10 FPS.
- Build only this animation with `node animations.mjs rotation-360`. The catalog entry is `animated-rotation-360`, and the animated WebP is `dist/animated/animated-rotation-360.webp`.
- The corrected sheet was made with the built-in image generation editor. Edit instruction: preserve the correct TOP tail and remove only the erroneous LOW/BOTTOM rear tails in all 25 frames; retain the original frame order, design, lighting, and transparent background.
