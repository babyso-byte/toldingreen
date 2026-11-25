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

For now the form builds a brief that the visitor sends by email to sonya@toldingreen.com. To receive submissions directly, connect a form service such as Formspree and post the form data to it from the submit handler in `site.js`.

## Publishing on GitHub Pages

1. Go to Settings → Pages.
2. Under Source, choose "Deploy from a branch", pick `main` and the `/ (root)` folder.
3. Once toldingreen.com is bought, enter it under Custom domain and point the domain's DNS at GitHub Pages.
