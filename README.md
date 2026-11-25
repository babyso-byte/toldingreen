# Told in green

Website for Told in green: PR, trade media and lead generation for agri-tech and horticulture companies.

A static site in plain HTML, CSS and JavaScript. It needs no build step and runs on any static hosting, including GitHub Pages.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `services.html` | Services |
| `pricing.html` | Pricing calculator |
| `about.html` | About |
| `contact.html` | Contact form |

## Files

- `styles.css` holds the shared styles for every page.
- `site.js` holds the halftone header animation, the tile glyphs, the pricing calculator and the contact form.
- `portrait.jpg` is the founder photo on the About page.
- `favicon.png` is the site icon.
- `brand/` holds the logo PNGs: dark, white and mark only.

## Editing prices

Prices, presets, the term discounts and the language surcharge are set at the top of the pricing section in `site.js`, in `ITEMS`, `PRESETS` and `TERMS`.

## Contact form

The form sends each lead through Web3Forms to sonya@toldingreen.com. The access key is `W3F_KEY` at the top of `site.js`; it is public by design. If sending fails, the visitor sees the brief with a mailto link instead.

## Publishing on GitHub Pages

1. Go to Settings → Pages.
2. Under Source, choose "Deploy from a branch", pick `main` and the `/ (root)` folder.
3. Once toldingreen.com is bought, enter it under Custom domain and point the domain's DNS at GitHub Pages.
