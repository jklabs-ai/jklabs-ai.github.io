#!/usr/bin/env python3
"""Create assets/img/og-image.png at 1200×630.

Black text on white, with a teal accent bar. Draws only:
  Joseph Kim
  Founder-operator turning AI capabilities into deployed products and workflows.

Requires Pillow. This script does not install packages and does not write a
file when Pillow is missing.
"""

from pathlib import Path
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.stderr.write(
        "Pillow is not installed. No PNG was written. "
        "Use assets/img/og-image-template.html as a 1200×630 screenshot source, "
        "or install Pillow only after separate approval and run this script again.\n"
    )
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "img" / "og-image.png"
WIDTH = 1200
HEIGHT = 630
ACCENT = "#0F5C5C"
INK = "#111111"
PAPER = "#FFFFFF"
NAME = "Joseph Kim"
LINE = "Founder-operator turning AI capabilities into deployed products and workflows."


def load_font(size):
    candidates = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    for path in candidates:
        if Path(path).is_file():
            try:
                return ImageFont.truetype(path, size=size)
            except OSError:
                continue
    return ImageFont.load_default()


def wrap(draw, text, font, max_width):
    lines = []
    current = ""
    for word in text.split():
        trial = word if not current else current + " " + word
        if draw.textbbox((0, 0), trial, font=font)[2] <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def main():
    image = Image.new("RGB", (WIDTH, HEIGHT), PAPER)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 16, HEIGHT), fill=ACCENT)

    name_font = load_font(72)
    line_font = load_font(36)
    max_width = WIDTH - 72 - 64
    name_lines = wrap(draw, NAME, name_font, max_width)
    body_lines = wrap(draw, LINE, line_font, max_width)

    name_heights = [
        draw.textbbox((0, 0), line, font=name_font)[3] for line in name_lines
    ]
    body_heights = [
        draw.textbbox((0, 0), line, font=line_font)[3] for line in body_lines
    ]
    name_gap = 8
    block_gap = 28
    body_gap = 10
    block_height = (
        sum(name_heights)
        + name_gap * (len(name_lines) - 1)
        + block_gap
        + sum(body_heights)
        + body_gap * (len(body_lines) - 1)
    )
    y = (HEIGHT - block_height) / 2
    x = 72

    for line, height in zip(name_lines, name_heights):
        draw.text((x, y), line, fill=INK, font=name_font)
        y += height + name_gap
    y += block_gap - name_gap
    for line, height in zip(body_lines, body_heights):
        draw.text((x, y), line, fill=INK, font=line_font)
        y += height + body_gap

    OUT.parent.mkdir(parents=True, exist_ok=True)
    image.save(OUT, "PNG")
    print(OUT)


if __name__ == "__main__":
    main()
