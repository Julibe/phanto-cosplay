# Rotation animation variants

Keep all user-requested variants. Do not replace or delete a variant when adding another.

Phanto has three closed-eye and three open-eye rotations:
- Top tail only: the pointed curl remains on top throughout the turn.
- Bottom tail only: a low rear tail, without a top point.
- Mixed tail position: use the user's reference pattern, with a top tail from the front and a low rear tail from the back. One tail per frame, not both.

Berry has one stern, open-eye rotation matching the existing red strawberry design.

Each animation uses a 5 by 5 PNG sheet, row-major frame order, 24 playback frames, 10 FPS (the duplicate frame25 is excluded and its grid cell is blank), and a transparent looping animated WebP. The existing Idle and Celebrate animations must remain intact.

Built-in image editor instructions for the open-eye sheets: replace only closed-eye strokes with open dark plum oval eyes and small white catchlights; retain each reference sheet's tail pattern, mouth, blush, shape and orientation; no face on back views. Remove background haze and preserve alpha transparency.

Rotation framing uses the main body, excluding tails and flippers, as the scale and pivot reference. `preserveCanvas` prevents the exporter from trimming or resizing these aligned frames. Keep the full320x320 cell when encoding.
