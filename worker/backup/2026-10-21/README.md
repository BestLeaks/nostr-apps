# nostr-apps.zamrock.net — Cloudflare Worker backup

Backup of the `nostr-apps-proxy` worker that serves `nostr-apps.zamrock.net`
(proxies to Codeberg Pages: `https://ZamRock-Radio.codeberg.page/nostr-apps-deploy`).

Taken 2026-10-21 via Cloudflare API.

| File | Contents |
|------|----------|
| `deployed-index.js` | Exact worker script running in production (`sha256 e057e126157fc6fe1c643fb79cf94017f75bb9c441bf65191765fe4d87f29a71`) |
| `api-response.raw` | Raw multipart response of the script fetch (CF API) |
| `api-versions.raw` | Worker version history (6 versions, latest `d5ff5722`, 2026-09-03) |
| `api-worker-domains.raw` | Custom domain binding: `nostr-apps.zamrock.net` -> `nostr-apps-proxy.production` |
| `api-deployments.raw` | Deployments endpoint (404 — not exposed for this worker) |
| `wrangler.jsonc` | Worker config (name, compatibility_date, account_id) |

Restore: `npx wrangler deploy --config wrangler.jsonc` from a dir containing `src/index.js`
(the deployed script is the bundled form of `nostr-apps-deploy/worker/src/index.js`).
