# slicedearth portfolio

[![MIT Licence](https://img.shields.io/badge/Licence-MIT-blue.svg)](LICENSE.md)

The source for [www.slicedearth.dev](https://www.slicedearth.dev), a portfolio
of digital projects and web operations. The projects explore domain intelligence,
public data and useful web tools.

## Built with

- [Astro](https://astro.build/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Three.js](https://threejs.org/)
- [Playwright](https://playwright.dev/)
- [axe-core](https://github.com/dequelabs/axe-core)

The site renders with Astro and uses native browser controls for navigation.
The hero starts with an optimised static image. On wide viewports, it
progressively loads a matching Three.js scene with a sliced globe, restrained
route movement and pointer interaction. Narrow layouts, reduced-motion
preferences and data-saving connections retain the static version. The static
view control stops the renderer; preference changes and optional loading or
WebGL failures also restore the poster. No preference is stored between visits.

The featured project uses a static, responsive screenshot so it remains clear
and lightweight across desktop, tablet and mobile layouts.

Node.js 24 is used locally, in CI and for Netlify builds.

When `PUBLIC_GA_TRACKING_ID` is configured, the site records page visits and
named outbound project, case-study, repository and profile clicks. Advertising
personalisation and Google Signals are disabled. Builds without the variable do
not load analytics. The remote analytics library loads after the initial render
or on the first interaction.

## Commands

| Command                      | Action                                               |
| :--------------------------- | :--------------------------------------------------- |
| `npm ci`                     | Install the locked dependencies                      |
| `npm run dev`                | Start local development                              |
| `npm run check`              | Check Astro components and TypeScript                |
| `npm run build`              | Build the production site                            |
| `npm run budget`             | Check HTML, font, CSS, JS and image budgets          |
| `npm run links:check`        | Check outbound links in the production build         |
| `npm run security:check`     | Check generated scripts against the production CSP   |
| `npm run test:e2e`           | Build with a fake analytics ID and run browser tests |
| `npm run test:e2e:built`     | Reuse an existing fake-ID build for browser tests    |
| `npm run test:analytics:off` | Build and run only the analytics-off contract        |
| `npm run test:contracts`     | Check JSON-LD escaping and CSP parsing               |
| `npm run brand:assets`       | Regenerate Earth, favicon and social image assets    |
| `npm run format:check`       | Check source formatting                              |

The performance budget caps initial and deferred JavaScript, CSS, fonts, HTML
and generated images. The optional desktop hero scene has separate raw and gzip
limits so its cost cannot weaken the budgets for the rest of the site.

CI checks the responsive Chromium experience plus focused Firefox and WebKit
smoke coverage with one browser worker. Analytics requests are intercepted and
never reach Google during tests. The fake ID is applied before the test build;
ordinary development does not gain a tracking ID. The analytics-off check uses
separate temporary output and does not repeat the full browser matrix.

The CSP guard checks the committed policy structure and generated scripts. It
does not verify live hosting headers or establish production CSP compliance.
A weekly workflow checks the public links rendered by the production build.

## Licensing

The portfolio source is available under the [MIT licence](LICENSE.md). Bundled
font and geographic-data details are recorded in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
