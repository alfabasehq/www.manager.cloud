# Manager Cloud website

The public pages of [Manager Cloud](https://www.manager.cloud), the cloud edition of Manager.io accounting
software. A static site built with [Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages.

## Commands

```
npm install      # once
npm start        # local preview at http://localhost:8080, rebuilds on change
npm run build    # writes the site to _site/
```

Pushing to `main` builds and deploys the site (`.github/workflows/pages.yml`).

## Where things are

| Path | What it holds |
|---|---|
| `src/index.njk` | Home page: hero, pricing, features and FAQ. Prices are in the page's front matter |
| `src/accountants.njk` | Accountants directory, a StoreRocket widget loaded by `public/js/accountants.js` |
| `src/advisors.njk`, `src/advisor-profile.njk` | Advisor directory and one advisor's page (`/advisors/profile/?username=…`) |
| `src/terms-of-use.njk`, `src/privacy-policy.njk` | Legal pages |
| `src/404.njk` | Not-found page, which also forwards the app's old addresses (see below) |
| `src/_includes/layout.njk` | Page shell: head, header and footer |
| `src/_data/site.json` | Address of this site (`url`) and of the app (`app`) |
| `public/` | Files copied to the site as they are: stylesheet, scripts, icons, `robots.txt` |
| `eleventy.config.js` | Build configuration |

## The app

Everything that needs a signed-in user — free trial sign-up, the customer portal, an accountant's own
listing, the advisor dashboard, admin — is the ManagerCloud project, an ASP.NET app with the API. Its
address is `app` in `src/_data/site.json`, and every link to it is built from that one value.

- The content of this site was taken from that project's `wwwroot/`. `public/styles.css` is its
  stylesheet cut down to what the pages here use, so the two look the same.
- The advisor pages read the directory in the browser from the app's anonymous `GET /api/advisors/*`
  and `/api/languages` endpoints, so the app has to answer those with `Access-Control-Allow-Origin`
  for this site.
- Contacting an advisor needs a signed-in sender, so that button leads to the app's copy of the
  advisor's page.
- `/free-trial`, `/portal`, `/public-profile`, `/advisors/dashboard` and `/admin` were served from this
  address before and are still linked from emails, Stripe return URLs and bookmarks. They do not exist
  here, so GitHub Pages serves `404.html`, which sends them on to the app with the path, query and
  hash kept.
