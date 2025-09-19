
# DADVENTURES - FullBuild-TestedFinal (Updated)

This package includes your requested fixes and seeded data. To replace the shared background, overwrite `images/bronze-net.png` with your provided background file (keep the same filename). The welcome page uses `images/welcome-bonsai.svg`. The top logo uses `images/logo-icon.svg` (transparent, no wordmark).

## Deploy (Netlify)
1) Create new site from Git or drag-drop this folder.
2) Ensure `netlify.toml` is present (redirects `/` -> `/splash.html`).
3) Netlify Forms: submit contact once, then enable email notifications.
4) Netlify CMS: Settings -> Identity ON -> Services -> Git Gateway ON. Visit `/admin`.

## Where Things Live
- Welcome screen: `splash.html`
- Global header/footer and music: across all pages
- Events data: `content/events/events.json`
- Shop data: `content/products/products.json`
- Email templates: `content/pages/email-donation.html`, `content/pages/email-purchase.html`
- Debug panel: `/debug.html` (CSV download, clear, close)

## Notes
- Donations and purchases are simulated with local success pages for testing.
- Replace images as needed; keep filenames to avoid broken paths.
