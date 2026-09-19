# envGo documentation site

The documentation site for [envGo](https://github.com/dnysaz/envgo) — a
zero-dependency, single-binary runtime that lets static HTML and vanilla
JavaScript use `.env` secrets without exposing them to the browser.

Built with [Astro](https://astro.build) and
[Starlight](https://starlight.astro.build).

## Requirements

- Node.js 18 or newer
- npm

## Commands

Run these from the project root:

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server at `localhost:4321` |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Preview the built site locally |

## Content

All pages are `.mdx` files under `src/content/docs/`:

```text
src/content/docs/
  index.mdx                 landing page
  download.mdx              build download links
  getting-started/          introduction, installation, quick start
  core-concepts/            how it works, security model, environment variables
  modes/                    local mode, public mode
  guides/                   deploy to VPS, TLS, PHP support, Docker
  reference/                CLI commands, configuration, threat model
```

The sidebar is defined in `astro.config.mjs`. Adding a page without registering it
there leaves it out of the navigation.

## Keeping it accurate

This site documents behaviour implemented in the
[envGo repository](https://github.com/dnysaz/envgo), which is a separate project.
A change to the Go source does not update these pages automatically — check the
relevant page whenever you change:

- a flag, subcommand, or default → `reference/cli-commands.mdx`
- a routes-config field or validation rule → `reference/configuration.mdx`
- an endpoint, header name, or status code → `reference/cli-commands.mdx` and the mode pages
- rate limiting, scrubbing, or PHP behaviour → `core-concepts/security-model.mdx` and the guides

Please state explicitly when an example is illustrative rather than required
configuration.

## Adding a release

Update the version on `download.mdx` after cutting a new release in the envGo
repository. The download URLs themselves point at `/releases/latest/download/…`
and do not need changing.
