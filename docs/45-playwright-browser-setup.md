# Playwright Chromium setup

The supported pair is exactly `playwright@1.62.1` and `playwright-core@1.62.1`. Install only its managed Chromium with the explicit setup command:

```bash
CONTENT_OPS_PLAYWRIGHT_BROWSERS_PATH="$PLUGIN_DATA/playwright-browsers" pnpm renderer:setup
```

Repository development may point `PLAYWRIGHT_BROWSERS_PATH` at an explicit repository-external cache. Installed Plugin operation resolves the controlled cache under Plugin Data. The browser must not be stored in Git, Plugin Root or a project output directory, and an arbitrary executable path, package, version, shell command or browser argument is never accepted.

Run `pnpm renderer:doctor` before production. Missing or mismatched managed Chromium is blocking; system Chrome and the Mock Renderer are not fallbacks. macOS and Linux require independent environment evidence because browser builds and fonts can produce different pixels.
