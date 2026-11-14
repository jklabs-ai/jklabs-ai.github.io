# Joseph Kim

Personal portfolio site for Joseph Kim. Plain HTML, CSS, and a small vanilla script. English only. No framework, build step, analytics, or cookies.

Expected public URL: <https://jklabs-ai.github.io/>

GitHub Pages source: branch `main`, folder `/` (repository root). `.nojekyll` is present so Pages serves the files as they are.

## Preview locally

From this directory:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

Opening `index.html` directly (`file://`) cannot load Writing. Browsers block `fetch` of `data/posts.json` from a file URL. Use the local server above.

## Theme

The first visit follows the operating system colour scheme. The header control switches theme and saves only that choice in `localStorage` under the key `theme`. After a manual choice, system changes are ignored until the saved value is cleared. If storage is blocked, the control still switches the current view and the page does not throw.

Without JavaScript, colours follow the system preference and the theme control is hidden. Section links in the header stay available.

## Add a post

1. Add one object to `data/posts.json`. Keep the file as a JSON array, newest or oldest order does not matter; the page sorts newest first.
2. Optionally put an image in `assets/img/posts/` and set `image` to that root path, for example `"/assets/img/posts/note.png"`.
3. Commit both files when you are ready to publish.

```json
{
  "title": "Note title",
  "url": "https://www.linkedin.com/in/josephkimhk/",
  "platform": "LinkedIn",
  "date": "2026-11-14",
  "summary": "One line summary.",
  "image": "/assets/img/posts/note.png",
  "featured": false
}
```

`platform` is a label such as LinkedIn, Medium, Substack, X, or Site. `date` is `YYYY-MM-DD` and is shown as a date-only value. `url` must be `http` or `https`. `image` must be a local file under `/assets/img/posts/`. `featured` is reserved and does not change order. An empty array shows: “Writing is on the way. For now, I post on LinkedIn.”

## Add a project screenshot

Put the file in `assets/img/projects/`, then add a figure in `index.html` where the matching TODO comment is. Do not point an `img` at a file that is not there yet.

```html
<figure class="project-shot">
  <img src="/assets/img/projects/dataplug-1.png" alt="Describe what the screen shows." width="1200" height="750" loading="lazy">
</figure>
```

Use `tracenote-1.png` for TraceNote. If a listed image fails to load, the script removes that figure. Write alt text that describes the picture.

## Add the resume

Place the file at `assets/resume/Joseph-Kim-Resume.pdf`. Then remove the Resume TODO comments in `index.html` and restore:

- Hero: Resume as the primary button, before LinkedIn, opening the PDF in a new tab. LinkedIn returns to an outlined button.
- Background: the sentence “Full details in my resume.” linking to the PDF.
- Contact: a Resume link with Email, LinkedIn, and GitHub.

Until that file exists, those links stay omitted so the site does not advertise a missing PDF.

## Share image

`assets/img/og-image.png` is not in the repo yet, and the page does not reference it. When [Pillow](https://python-pillow.org/) is already installed, run:

```bash
python3 scripts/make_og_image.py
```

That writes a 1200×630 black-on-white image. If Pillow is not installed, screenshot `assets/img/og-image-template.html` at 1200×630 CSS pixels and save that PNG to `assets/img/og-image.png`. Then add the Open Graph and Twitter image tags in `index.html`. Do not rename the HTML template to `.png`.
