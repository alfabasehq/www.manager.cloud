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
| `src/advisors.njk` | Advisor directory: the advisor portal's page in a frame, plus FAQ |
| `src/terms-of-use.njk`, `src/privacy-policy.njk` | Legal pages |
| `src/404.njk` | Not-found page, which also forwards the addresses that moved to the app (see below) |
| `src/_includes/layout.njk` | Page shell: head, header and footer |
| `src/_data/site.json` | Address of this site (`url`) and of the app (`app`) |
| `public/` | Files copied to the site as they are: stylesheet, scripts, icons, `robots.txt` |
| `eleventy.config.js` | Build configuration |

## The app

Everything that needs a signed-in user — free trial sign-up, the customer portal, admin — is the
`my.manager.cloud` project, an ASP.NET app with the API, at <https://my.manager.cloud>. That address is
`app` in `src/_data/site.json`, and every link to it is built from that one value.

- This site and that app were one project, `ManagerCloud`, served from this address. The content here was
  taken from its `wwwroot/`. `public/styles.css` is its stylesheet cut down to what the pages here use,
  so the two look the same.
- Nothing here calls the app's API. The two only link to each other.
- The advisor directory is not this site's either: `/advisors/` frames the advisor portal's page
  (<https://advisors.manager.cloud/embed>), which posts its height so the frame can grow to fit.
  Advisors work in that portal, and accountants maintain their listing at
  <https://accountants.manager.cloud>.
- `/free-trial` (and an advisor's referral link, `/free-trial/{advisor}`), `/portal` and `/admin` were
  served from this address before and are still linked from emails, Stripe return URLs and bookmarks.
  They do not exist here, so GitHub Pages serves `404.html`, which sends them on to the app with the
  path, query and hash kept. The same page sends `/advisors/dashboard`, `/public-profile` and
  `/advisors/profile` to where those went.
- That forwarding is a script in a page, so it works for people and not for programs. Anything that
  calls `https://www.manager.cloud/api/...` has to be changed to `my.manager.cloud` before this site
  takes over the address.

## Custom domain

The site is deployed by a GitHub Actions workflow, so the domain is set in the repository's
**Settings → Pages → Custom domain** (`www.manager.cloud`), not by a `CNAME` file. DNS needs a `CNAME`
record for `www` pointing at `alfabasehq.github.io`. Until that is done the site is served from
`alfabasehq.github.io/www.manager.cloud/`, which the build allows for (see `--pathprefix` in the
workflow).
