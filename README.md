# slicedearth portfolio

[![MIT Licence](https://img.shields.io/badge/Licence-MIT-blue.svg)](LICENSE.md)

The source for [slicedearth.dev](https://slicedearth.dev), my portfolio for
software engineering and project delivery work.

## Built with

- [Astro](https://astro.build/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Playwright](https://playwright.dev/)
- [axe-core](https://github.com/dequelabs/axe-core)

The site renders with Astro and uses native browser controls for navigation.
The hero uses an optimised static terrain asset, avoiding a decorative runtime
and keeping the same composition across desktop, tablet and mobile viewports.

The featured project uses a static, responsive screenshot so it remains clear
and lightweight across desktop, tablet and mobile layouts.

Node.js 24 is used locally, in CI and for Netlify builds.

When `PUBLIC_GA_TRACKING_ID` is configured, the site records page visits and
named outbound project, case-study, repository and profile clicks. Advertising
personalisation and Google Signals are disabled. Builds without the variable do
not load analytics. The remote analytics library loads after the initial render
or on the first interaction.

## Commands

| Command                  | Action                                             |
| :----------------------- | :------------------------------------------------- |
| `npm install`            | Install dependencies                               |
| `npm run dev`            | Start local development                            |
| `npm run check`          | Check Astro components and TypeScript              |
| `npm run build`          | Build the production site                          |
| `npm run budget`         | Check HTML, font, CSS, JS and image budgets        |
| `npm run security:check` | Check generated scripts against the production CSP |
| `npm run test:e2e`       | Build and test the site in responsive browsers     |
| `npm run test:e2e:built` | Test an existing production build                  |
| `npm run brand:assets`   | Regenerate favicons and the social preview image   |
| `npm run format:check`   | Check source formatting                            |

The performance budget caps initial and deferred JavaScript, CSS, fonts, HTML
and generated images, with an additional gzip limit for deferred JavaScript.

## Licensing

The portfolio source is available under the [MIT licence](LICENSE.md). Bundled
font attribution is recorded in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
