# Project status

Portfolio implementation for review. Nothing has been committed, pushed, or deployed. GitHub settings were not changed.

## Completed

Plain HTML, CSS, and vanilla JS site from `PORTFOLIO_SPEC.md`.

- Hero, projects, writing, background, and contact use the supplied copy.
- Resume links are omitted. LinkedIn is the primary hero action.
- Project screenshots are not requested. Slots are HTML TODO comments.
- Open Graph and Twitter image tags are omitted. `scripts/make_og_image.py` and `assets/img/og-image-template.html` are ready. No PNG was invented.
- Light and dark themes, section rail, narrow header links, rocket, and writing renderer are implemented.
- `data/posts.json` is `[]`.
- `PORTFOLIO_SPEC.md` was left in place.

## Checks performed

- `node --check main.js`: passed.
- `data/posts.json` parses as `[]`.
- Python HTML parser: one `h1`, unique ids, tags balanced.
- W3C Nu validator (`https://validator.w3.org/nu/`, 15 Nov 2026): `messages` empty.
- Apple HTML Tidy (2006) only reports that it does not understand HTML5, SVG, and ARIA. Those warnings were not treated as failures.
- `python3 scripts/make_og_image.py`: exit 1, Pillow missing, no PNG written.
- Contrast of the specified palette was calculated. Text and button pairs are above WCAG AA.
- Local server `python3 -m http.server 8000`. Page, CSS, JS, posts JSON, and favicon returned 200. Resume, screenshot, and OG paths were not requested by the page. Direct requests for the missing PDF and PNG return 404, as expected.
- Browser, dark and light themes: toggle label and icon match the current theme. Manual choice persists across reload and wins over a later OS change. Before a manual choice, an emulated OS scheme change updates the page. `localStorage.setItem` throwing still switches the theme and does not throw out of the click handler.
- Browser layout: no horizontal overflow at 320, 375, 720, 768, 1024, 1280, 1329, and 1440 CSS pixels. Header links show below 1200px. Rail shows at 1280, 1329, and 1440, with 44px hit areas and labels clear of the text column. Section gap is 64px at 720px and 96px at 768px. Buttons and the theme control are at least 44px.
- `#writing` lands with the heading below the sticky header and `aria-current="location"` on Writing. At the top, no section is current. Real scrolling activates Projects. At the document bottom, Contact is current.
- Rocket: hidden at the top; visible at the bottom without covering the footer line. One shake, then smooth scroll to `#top`, focus moves to the hero heading, and the rocket hides. A second click during the shake does not start another shake. With `prefers-reduced-motion: reduce`, scroll is instant and there is no shake. Open case studies stayed open.
- Writing, temporary data only: three valid cards rendered newest first (`14 Nov 2026`, `4 Mar 2026`, `2 Jan 2026`). A `javascript:` URL and an invalid date were dropped. A remote image and a missing local image used the platform fallback. Entries were removed. `posts.json` is `[]` again. Invalid JSON keeps the LinkedIn empty state visible.
- Print emulation: white page, black text, case-study body displayed while `details` stays closed, and header links, rail, rocket, and theme control hidden.

## Checks not performed

- Full keyboard-only pass. One Tab press did not move focus off `body` through the available key event. Focus was moved with `preventScroll` onto the contact and hero headings during link and rocket activation.
- JavaScript disabled in the browser. The no-JS rules are in CSS (`html.enhanced` gates the toggle, rail, and rocket) but were not exercised with scripts turned off.
- Coarse pointer / touch emulation. Below 1200px the rail is already hidden.
- A viewport taller than the page, to prove the rocket stays hidden on a short page.
- A reload where `localStorage.getItem` throws. The blocked-read hook did not apply. The read is inside `try/catch` in the head script.
- 200% zoom as a browser zoom factor. 720 CSS pixels was checked instead, which is the layout width of a 1440px screen at 200% zoom. No horizontal overflow there.
- Screenshot of every width after the final scroll-margin fix. Measurements above were taken. Visual screenshots were taken earlier at 320, 375, 1280, and the contact footer.

## TODOs and pre-publication items

- Add `assets/resume/Joseph-Kim-Resume.pdf`, then restore the Resume button, the background sentence, and the contact Resume link. TODO comments mark those three spots.
- Add `assets/img/projects/dataplug-1.png` and `tracenote-1.png`, then add the figures at the TODO comments. Describe each image in its alt text.
- Create `assets/img/og-image.png` (1200×630) with Pillow via `scripts/make_og_image.py`, or by screenshotting `assets/img/og-image-template.html`. Then add the image meta tags. Do not publish the template as a PNG.
- Owner should confirm supplied claims and statuses, including AlgoBlocks figures, the DataPlug “72 passing” line, live/paused labels, and the BC Group / OSL wording. They were not changed.
- The site mailto is `0xjosephk@pm.me`. The git author address is different. Both were left as they are.
- `data/posts.json` has no posts. The empty state links to LinkedIn.

## Next session

Preview at http://127.0.0.1:8000/ with `python3 -m http.server 8000` from this directory. Do not commit or push until the owner asks. Publishing `main` would update the existing GitHub Pages site at https://jklabs-ai.github.io/.
