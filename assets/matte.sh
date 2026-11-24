#!/bin/sh
# Matte the owner's avatar: drop the sky-blue background, keep the subject.
# Usage: bash assets/matte.sh <your-avatar.png>
# Output: assets/logo-cut.png (192px, RGBA). Requires ffmpeg.
set -e
SRC="$1"
OUT="$(dirname "$0")/logo-cut.png"
if [ -z "$SRC" ]; then
  echo "usage: bash assets/matte.sh <your-avatar.png>" >&2
  echo "  mattes a flat-background image into assets/logo-cut.png, then run:" >&2
  echo "  node tools/build-plugin.mjs --logo assets/logo-cut.png" >&2
  exit 2
fi
ffmpeg -v error -y -i "$SRC" \
  -vf "chromakey=0x5ABEFB:similarity=0.14:blend=0.04,format=rgba,scale=192:192:flags=lanczos" \
  "$OUT"
echo "$OUT"
