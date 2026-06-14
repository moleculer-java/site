# TODO — Refresh `site` (documentation) — DO THIS **LAST**

> **You are the per-project Claude Code instance for `site`.** Self-contained file.
> ⚠ **Do not start until all nine library projects are modernized and their final `2.0.0` versions
> are locked.** This repo is the **documentation website** (VuePress 1.x → built into `docs/`,
> served at https://moleculer-java.github.io/site/). It contains **no library code** — only Markdown
> and the static build. Its job in this effort: bring every documented version/API in line with the
> modernized `2.0.0` libraries.

## Source vs. output (critical)
- `src/` = authoring source (edit Markdown here). `src/.vuepress/config.js` holds title,
  `base: '/site/'`, `dest: '../docs'`, nav, **sidebar**, plugins.
- `docs/` = generated build output, committed to git, served by GitHub Pages. **Never hand-edit
  `docs/`.** A normal change edits `src/`, rebuilds, and commits the regenerated `docs/`.
- Build must be run **from inside `src/`** (because `dest:'../docs'` is relative to CWD):
  ```bash
  cd src
  npx vuepress dev .      # preview
  npx vuepress build .    # build → ../docs
  ```

## What to update (after libraries are at 2.0.0)
1. **Dependency versions are hard-coded throughout the Markdown** (artifacts
   `com.github.berkesa:moleculer-java`, `:moleculer-java-web`, and the datatree artifacts). Grep all
   of `src/*.md` and bump every version to **`2.0.0`**. Coordinates (groupId:artifactId) are
   unchanged — only versions change. Keep them consistent across pages, then rebuild.
2. **Maven/Gradle install snippets:** the docs likely show Gradle and old coordinates. Update to
   **Maven `<dependency>`** snippets at `2.0.0`. (Gradle snippets can stay as an alternative, but the
   primary build is now Maven.)
3. **Java baseline:** update any "requires Java 8" statements to **Java 21**.
4. **Removed/renamed features:** reflect the 2.0 changes — dropped adapters in `datatree-adapters`
   (boon, fastjson v1, sojo, flexjson, jsoniter, JSONUtil, json-simple, grison-jtoml), dropped
   moleculer backends (Sigar→OSHI/JMX, OHC, NATS-Streaming), `javax`→`jakarta` for the web gateway
   (servlet/Jetty) and Spring 6 / Boot 3, lettuce `io.lettuce` coordinates, JColor. Fix any code
   examples that used removed APIs.
5. **Publishing/install:** if the docs describe how to consume/publish, point at Maven Central via
   the current coordinates (no OSSRH references).
6. **Rebuild & commit** `docs/`. Verify internal links (they use `.html`, not `.md`) and the sidebar
   (`src/.vuepress/config.js`) still resolve.

## Optional (only if desired)
- Modernize the toolchain: **VuePress 1.x → 2.x** (Node/Vue 3). This is a separate, larger change —
  do it only if asked; otherwise keep VuePress 1.x and just refresh content.
- Add a `package.json` so the site isn't dependent on `npx` resolving VuePress ad hoc.

## Cleanup
- `.project` (Eclipse) can be removed. There's no Gradle/Travis/Codacy here to clean.
- Add a `.vscode/extensions.json` recommending a Markdown/Vue setup if helpful (optional).

## Definition of done
- Every documented version is `2.0.0`; examples use Maven + current/renamed APIs + Java 21.
- Removed features no longer documented as available; jakarta/Spring 6 reflected.
- `src/` edited, `docs/` rebuilt and committed, links + sidebar intact.
