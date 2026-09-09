---
name: legal-lakrids-pages-deploy
description: Builds and deploys the Legal Lakrids website to its custom-domain GitHub Pages site. Use when the user asks to deploy, publish, release, update the live website, or push the current Legal Lakrids site to GitHub Pages.
compatibility: Requires Node.js, npm, git, GitHub push access, and the repository's existing Vite and gh-pages dependencies.
metadata:
  author: Legal Lakrids
  version: "1.0"
---

# Deploy Legal Lakrids to GitHub Pages

Publish the current `main` branch through the repository's established legacy GitHub
Pages workflow. The source site is built by Vite and the generated `dist` directory is
committed to the root of the `gh-pages` branch by the `gh-pages` npm package.

## Repository deployment model

- `package.json` defines `predeploy` as `npm run build`.
- `package.json` defines `deploy` as `gh-pages -d dist`.
- Running `npm run deploy` automatically runs `predeploy` first.
- GitHub Pages serves the root of the `gh-pages` branch.
- `public/CNAME` contains `legallakrids.com`; Vite copies it to `dist/CNAME`, and the
  deployment must preserve it.
- The Vite base path is `/` because the site uses a custom root domain.
- Deployments are direct branch publications, not GitHub Actions workflow runs.

Do not replace this mechanism, force-push `gh-pages`, manually commit generated files,
or edit the main checkout unless the user explicitly requests a deployment migration.

## Deployment procedure

1. Establish the release source.
   - Run `git status --short`.
   - The source worktree must contain no uncommitted changes. If changes exist, do not
     deploy them implicitly; ask the user to commit or discard them.
   - Fetch `origin main` and verify that `HEAD` equals `origin/main`. Do not deploy a
     local-only commit or an older source revision.
   - Confirm `package.json`, `vite.config.js`, and `public/CNAME` still describe the
     deployment model above. If they differ, follow the current repository configuration
     rather than these historical notes.

2. Prepare and validate.
   - If `node_modules` is missing, run `npm ci --no-audit --no-fund`.
   - Run `npm run lint`.
   - Run `npm run build`.
   - Confirm `dist/index.html` and `dist/CNAME` exist.
   - Confirm `dist/CNAME` contains exactly `legallakrids.com`.

3. Publish.
   - Run `npm run deploy`.
   - This performs a second production build through `predeploy`, then publishes `dist`
     to `origin/gh-pages`.
   - Do not run the deployment in parallel with another build or deployment.

4. Verify GitHub Pages.
   - Fetch `origin gh-pages`.
   - Confirm the remote `gh-pages` commit changed and contains `CNAME`, `index.html`, and
     the newly generated asset filenames from `dist`.
   - Query `gh api repos/geoox/legallakrids/pages/builds/latest`.
   - Wait until the build reports `built` or `errored`; GitHub Pages publication may take
     several minutes. Do not report success while it is merely queued or building.
   - If the build errors, report its error message and stop.

5. Verify the live site.
   - Request `https://legallakrids.com/` with cache bypass and retries.
   - Confirm the response is successful and its HTML references the newly deployed
     JavaScript asset.
   - For content changes, request or inspect the relevant live hash route and verify the
     expected title or content in the loaded application when browser tooling is
     available.

## Safety and failure handling

- Never deploy from a dirty worktree.
- Never use `--force` or rewrite `gh-pages` history.
- Never delete the custom-domain `CNAME`.
- Never claim that a successful `npm run deploy` means the public site is live; wait for
  the GitHub Pages build and live-site verification.
- If authentication fails, leave the generated build untouched and report the exact
  blocked push.
- If `origin/main` advances during the release, stop and require the source branch to be
  reconciled before retrying.

## Completion response

Report the source commit, resulting `gh-pages` commit, GitHub Pages build status, and
live URL. Keep failure reports explicit about which stage failed.
