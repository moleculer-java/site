# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is the **documentation website** for *Moleculer for Java* (a JVM implementation of the
[Moleculer](http://moleculer.services/) microservices framework). It contains **no library code** —
only documentation content and a static-site build of it. The actual framework lives in separate
repos (e.g. `moleculer-java/moleculer-java`, `moleculer-java-web`).

The site is built with **VuePress 1.x** and published via GitHub Pages at
`https://moleculer-java.github.io/site/` (note the `/site/` base path).

## Source vs. generated output (most important distinction)

- `src/` — **authoring source.** Edit Markdown here.
  - `src/*.md` — one file per documentation page.
  - `src/README.md` — the VuePress homepage (uses `home: true` frontmatter, not normal prose).
  - `src/.vuepress/config.js` — site config: title, `base: '/site/'`, `dest: '../docs'`, nav, **sidebar**, plugins.
  - `src/.vuepress/public/` — static assets (svg/png/gif) referenced by docs.
  - `src/.vuepress/styles/palette.styl` — theme overrides (accent color `#37996B`).
- `docs/` — **generated build output, committed to git.** GitHub Pages serves this folder.
  **Never hand-edit `docs/`** — it is overwritten on every build. Commits like "Regenerated pages"
  / "Rebuild" are the result of rebuilding, not manual edits.

A normal change touches **both** trees: edit `src/`, rebuild, and commit the regenerated `docs/`.

## Build / preview

There is **no `package.json`** in this repo, so VuePress is not installed locally — use `npx`
(or a global install). The `dest: '../docs'` in `config.js` is resolved **relative to the current
working directory**, so commands must be run **from inside `src/`** for output to land in the
repo-root `docs/` folder:

```bash
cd src
npx vuepress dev .      # local dev server with hot reload (preview while editing)
npx vuepress build .    # build → ../docs  (the committed, GitHub-Pages-served output)
```

Running the build from the repo root instead would write `docs/` to the *parent* of the repo — don't.

## Conventions & gotchas

- **Adding/removing/renaming a page requires two edits:** create/rename `src/<name>.md` **and**
  update the `sidebar` array in `src/.vuepress/config.js` (entries are `['<filename-without-ext>', 'Sidebar Label']`).
  A page not listed in the sidebar won't appear in navigation.
- **Internal links use the `.html` extension**, not `.md` (e.g. `moleculer-web.html#routes`),
  because they point at the built output.
- **Local images** live in `src/.vuepress/public/` and are referenced by bare filename in raw HTML,
  e.g. `<img src="local-cacher.svg" class="zoom" />`. The `class="zoom"` enables click-to-zoom
  (vuepress-plugin-medium-zoom).
- **Maven/Gradle dependency versions are hard-coded throughout the Markdown** (artifacts
  `com.github.berkesa:moleculer-java` and `:moleculer-java-web`). Commits such as "New APIs",
  "Update API versions", and "New moleculer-core version" are coordinated version bumps across many
  `.md` files. When updating a version, grep all of `src/*.md` so the examples stay consistent, then rebuild.
