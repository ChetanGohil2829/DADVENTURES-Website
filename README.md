# DADVENTURES v1.0.1

Single ZIP with full site, seeded data, and docs.

## Setup
1. Unzip `DADVENTURES-v1.0.1.zip`.
2. Open `index.html` to see the Welcome screen (30s auto-redirect to Home).
3. For Events/Shop/Blog JSON to load locally, serve via a local server (e.g. `npx serve .`).

## Pages
- index.html (Welcome splash)
- home.html, about.html, events.html, shop.html, donate.html, contact.html, join.html
- blog.html, post.html
- debug.html (audit)
- login.html → `/admin`

## Music
Global audio controls in header and fixed footer bar. Starts muted, loops when played.

## CMS
Sample Netlify CMS config at `cms/config.yml`. Update backend to your repo/identity.

## SEO
`sitemap.xml`, `robots.txt`, meta tags.

## Credits
Auto-generated scaffolding when base zip contents were not fully available.
