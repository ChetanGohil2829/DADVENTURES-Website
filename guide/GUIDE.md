
# DADVENTURES — Update Guide (with Troubleshooting)

## Quick Start
1. Upload everything (keep folders).
2. Replace placeholders:
   - `audio/relaxing-piano-ambient.mp3` → your track.
   - `images/logo.png`, `images/WELCOME_IMAGE.png`, `images/BACKGROUND.png` → your assets.
3. Deploy via GitHub → Netlify (SPA redirect handled by `netlify.toml`).

## Edit Text
- Home: `content/home.md`
- About: `content/about.md`

## Calendar + Maps
Update `content/events/events.json` with ISO dates and a Google Maps link in `"map"`.

## Shop Products
Edit `content/shop/products.json`. Each item: `name`, `price`, `link`.

## Theme & Styles
- Global colours, glows, buttons, nav, slider, search are in `css/styles.css` (black + gold).
- Logo (top-left) scales slightly with screen size; clicking it returns to **Home**.

## Music
- Autoplays **muted** (browser rules), fades in on first click.
- Loop is enabled. Controls: Play/Pause + volume (mobile-friendly).

## Transitions
- Welcome → **Home** after **15s** with fade.
- All sections fade-out then fade-in; content reveals are staggered.

## Debug Panel
- Click **Debug** (bottom-left) to open. Hidden by default. You can clear/download logs.

---

## Troubleshooting / Common Errors
- **White/blank page**: Check console; ensure all files uploaded.
- **404 on Netlify**: `netlify.toml` must be present.
- **Audio doesn’t play**: Needs a user gesture; press **Enable Sound** or click.
- **JSON error**: Validate commas/brackets in `events.json` / `products.json`.
- **Changes not visible**: Hard refresh (Ctrl/Cmd+Shift+R) or redeploy.

Enjoy!
