
# Dadventures – Quick Guide

- Edit text in `content/home/home.md` and `content/about/about.md`
- Events live in `content/events/events.json` (title, times, map link, route, image)
- Products live in `content/shop/products.json`
- Emails: see `emails/purchase.html` and `emails/donation.html`
- Audio loop in `audio/ambient.wav` (currently a small silent loop for policy-safe autoplay)
- Debug panel: click **Debug** bottom-left (only shows when toggled). It verifies data files, social links, routes and basic search.

## Welcome Screen
- Auto-redirects to Home after 30s.
- Music: autoplay muted; first tap/click enables audible playback. Volume slider controls volume on most browsers (iOS restricts programmatic volume).

## Deploy
- Zip this folder and upload to Netlify or GitHub Pages.
