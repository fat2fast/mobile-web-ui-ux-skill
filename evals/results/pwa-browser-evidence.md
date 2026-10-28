# PWA browser evidence

The executable checks are in `tests/task-ux/pwa-browser.spec.cjs`; run results belong to the current test run's artifact directory, not this tracked document. Record source revision, dirty/clean status, browser/version, test command and artifact location before treating a result as evidence. Local checks from a dirty worktree are exploratory. Same-commit PR `required-ci`: **NOT RUN**.

The fixture uses synthetic users and localhost, and tests CacheStorage and HTTP-cache behavior separately. Permission and target checks are simulated; OS install, actual permission UI, push subscription/delivery, physical keyboard and physical devices are **NOT RUN**. See [manual device replay](../tests/pwa-device-manual.md).
