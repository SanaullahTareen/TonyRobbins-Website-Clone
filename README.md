# Tony Robbins Website Clone

A static mirror of [tonyrobbins.com](https://www.tonyrobbins.com/), built by
downloading the server-rendered Next.js HTML, all static assets (CSS, JS, images,
fonts, videos), and rewriting URLs to serve everything locally.

## What's Included

**31 pages** covering the full site structure:

| Section | Pages |
|---|---|
| Homepage | `/` |
| About | `/the-story`, `/the-system`, `/the-science` |
| Programs | `/programs` |
| Events | `/events`, `/events-calendar`, + 9 individual event pages |
| Coaching | `/results-coaching`, `/business-coaching` |
| Podcasts | `/podcasts` + 4 episode pages |
| Shop | `/collections/all` |
| Other | `/start`, `/documentary`, `/the-mission`, `/free-resources`, `/blog`, `/network`, `/newsletters`, `/community` |

**All assets served locally** — images (Sanity CDN), videos (cdnsnty), Next.js
CSS/JS chunks, and fonts (Suisse Intl, IBM Plex Sans/Mono) are downloaded and
URLs rewritten so the clone works fully offline with no external hotlinks.

## Quick Start

```bash
# Start the local server
node serve.mjs

# Open http://localhost:8080
```

## Scripts

| Command | Description |
|---|---|
| `node serve.mjs` | Serve the clone locally (default port 8080) |
| `PORT=3000 node serve.mjs` | Serve on a custom port |
| `node mirror.mjs` | Re-download the full site (takes ~5 min, ~530 MB) |
| `node patch_missing_chunks.mjs` | Patch any missing JS chunks after a mirror run |

## Customising the Mirror

| Env var | Default | Description |
|---|---|---|
| `MAX_PAGES` | `32` | Max HTML pages to crawl |
| `VIDEOS` | `1` | Set to `0` to skip downloading videos (saves ~18 MB) |
| `PORT` | `8080` | Port for `serve.mjs` |

## How It Works

1. **Crawl** — BFS over internal links from a curated seed list of hub pages,
   capping at `MAX_PAGES`.
2. **Download assets** — Parse each page's HTML for `src`, `href`, `srcset`,
   `poster`, and `content` attributes plus Next.js flight-data strings; enqueue
   every CSS/JS/image/video/font URL for download.
3. **CSS discovery** — After downloading CSS, extract `url()` references and
   enqueue any fonts or images referenced.
4. **Localise CDN media** — Sanity CDN images and cdnsnty videos are saved under
   `/_media/` and all references rewritten (including `&amp;` and `&`
   variants in `srcset` and RSC flight payloads).
5. **Rewrite** — A final pass replaces all external media URLs with their local
   paths in every HTML and CSS file.

## Project Structure

```
.
├── serve.mjs              # Static server (clean URL support)
├── mirror.mjs             # Full site crawler/downloader
├── patch_missing_chunks.mjs  # Utility to fill any missing JS chunks
├── .claude/launch.json    # Browser preview config
└── site/                  # The cloned site (served from here)
    ├── index.html         # Homepage
    ├── _media/            # Localised images, videos, fonts
    ├── _next/static/      # Next.js CSS, JS chunks, self-hosted fonts
    ├── the-story/         # /the-story
    ├── events/            # /events
    └── ...                # Other pages
```

## Notes

- This is a **personal/educational clone** of the live site, not intended for
  commercial use or redistribution.
- All content, images, trademarks, and design are © Tony Robbins Productions.
- The clone reproduces the **server-rendered HTML output** — interactive
  elements (carousels, dropdowns, video playback) work on the homepage where all
  JS chunks are present; other pages render the full visual layout via SSR.
- Re-running `node mirror.mjs` re-downloads everything fresh (~5 minutes, ~530 MB).
