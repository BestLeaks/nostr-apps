# nostr-zamrock — Plan

An open, community-run directory of Nostr apps, bots and runners. Owned by everyone who uses it — anyone can fork it, add a listing, and deploy their own copy.

**Working title:** `nostr-zamrock.net`

---

## Why

`nostrapps.com` is basically abandoned — listings reportedly sit unreviewed for a year+.

We don't want to depend on someone else's review queue. Instead of just waiting (and instead of forking the old Go app), we build our own directory from scratch with the same *data*, fresh design, and a *much* easier contribution model.

Key insight that shapes everything: **nostrapps.com is a Go server** (templ + Tailwind + `apps.toml`), which **cannot** run on GitHub Pages or any static host. To let *anyone* run their own copy, we build as a **standalone Zola (static) site**.

---

## The core model

- **Data** = entries in one easy-to-edit format (TOML → Zola `content/`)
- **Anything that's static** = works everywhere: GitHub Pages, Cloudflare Pages, any VPS, any subdomain
- **Contribution** = `git clone` → add your app → open a PR. No accounts, no review gate, no approval queue
- **"You run it"** = clone, build, deploy to Pages, optionally point your own sub/domain at it (CNAME record to `<user>.github.io` or your host)

> "Everyone forks, submits a PR and gets listed. All site owners update easy, so the public has lots of sources to see apps."

---

## Stack decision: Zola

| | Go (nostrapps) | **Zola (this)** |
|---|---|---|
| Hosting | needs a server + systemd | static files, any host |
| GitHub/CF Pages | ❌ can't | ✅ drop-in |
| Everyone can run | build tools + Go | clone + build, trivial |
| Contribution | PR to `apps.toml` | PR to `content/` |
| We don't know Go | risk | — |

**Zola wins on the "everyone can run it" goal** that matters most.

### Zola setup (sketch)
```
nostr-zamrock/
├── config.toml            # site config, taxonomies
├── content/
│   ├── apps/              # one .md per app (front matter = metadata)
│   │   └── amethyst.md
│   ├── bots/              # one .md per bot
│   └── _index.md          # landing page (pulls taxonomy lists)
├── templates/
│   ├── index.html         # directory grid
│   ├── app.html           # single-app page
│   └── partials/*.html
├── sass/                  # our theme
└── static/                # assets
```
- Categories/platforms as **Zola taxonomies** → filter pages for free
- Zola's `content/` is git-friendly → clean PR diffs for adding an app
- Deploy via Zola GitHub Action → Pages, or Cloudflare Pages

---

## Sections (from day one)

1. **Apps** — the core listing (seeded from nostrapps' `apps.toml`)
2. **Bots** — nostr bots (Vector, Armada, and general)
3. **Runners / Sites** — pages/instances running this directory, so the public has many sources
4. (stretch) **Tools / NIP index**

---

## Data

- ~72 apps already listed in nostrapps' `apps.toml` (name, categories, description, gallery, features, npub, platforms, thumb, url)
- We'll **transfer listings over** by converting `apps.toml` → Zola `content/apps/*.md`
- We're **rebuilding design from scratch**, not copying nostrapps' look

---

## Hosting for us (vs. everyone else)

- **Everyone else:** clone → GitHub/CF Pages → own subdomain via CNAME. Zero servers.
- **Us (canonical):** `/Community deserves a *standalone* home`, so the canonical instance
  lives at **`nostr-apps.zamrock.net`** served by **Codeberg Pages** (deploy via the
  `git-pages` Forgejo action), with a `correct/`-style static output. Host-agnostic, so we
  can move it to our own Forgejo/tunnel later with zero refactor if needed.

### Canonical URL decision

- `base_url = "https://nostr-apps.zamrock.net"` (in `config.toml`)
- `static/CNAME = "nostr-apps.zamrock.net"` (custom domain marker)
- Codeberg Pages deployment:
  - `CNAME nostr-apps` → `codeberg.page.`
  - `TXT _git-pages-forge-allowlist.nostr-apps` → `https://codeberg.org/<owner>/nostr-zamrock.git`
  - `.forgejo/workflows/codeberg-pages.yml` builds Zola + deploys via `codeberg.org/git-pages/action@v2`
- Community contributors deploy their own fork standalone wherever they want (GitHub Pages,
  Cloudflare Pages, their own host, etc.) — no coupling to our canonical instance.

---

## Repos (mirrored, per plan)

| Host | Role |
|---|---|
| **Codeberg** | **canonical home** — hosts repo, builds via hosted Forgejo Actions, deploys `nostr-apps.zamrock.net` on Codeberg Pages. Community forks here. |
| **GitWorkshop (NIP-34 nostr git)** | **canonical / parent source** (signed commits, trust model). Push mirror later. |
| **Our Forgejo `git.zamrock.net`** | **backup mirror + our build/deploy pipe** (self-hosted runner). Push mirror later. |
| GitHub | secondary fork/Pages path for contributors who have free GH Pages |

Auto-mirror between them since GitWorkshop is a *source* (no CI), GitHub carries the build/deploy for everyone.

## Trust model — no stale review queue

The whole point is to avoid the nostrapps.com problem (listings rotting for a year
waiting on approvals). Because GitWorkshop uses **NIP-34 nostr-git**, every commit is
**signed by the contributor's nostr keypair** — trust is tied to a pubkey, not a
platform account.

- Maintain a **trusted-dev pubkey list** in the repo.
- Trusted nostr devs' signed commits are **auto-accepted** — they can land listing
  changes directly, no approval gate.
- New/unknown contributors open a PR (or signed patch) that trusted devs merge.
- Result: the directory **stays live** and listings flow in/out without a bottleneck,
  and untrusted contributions are gated only by the trusted set.

## CI — one workflow, host-aware

### Codeberg DOES host Forgejo Actions (production-ready)
Codeberg's [actions/meta](https://codeberg.org/actions/meta) confirms hosted Forgejo
Actions are production-ready. Runners: `codeberg-tiny` (2G/2min), `codeberg-small`
(4G/5min), `codeberg-medium` (8G/10min), plus `-lazy` variants. So Codeberg **builds
and deploys** the canonical site itself — no self-hosted runner required for Codeberg.
`runs-on` must be a Codeberg label (e.g. `codeberg-small`).

Same workflow runs everywhere; it adapts by host (matrix of runner labels + gated deploy steps):

| Host | Runner | Deploy |
|---|---|---|
| **Codeberg (canonical)** | hosted `codeberg-small` | Codeberg Pages (`nostr-apps.zamrock.net`) via git-pages action |
| GitHub (forks) | hosted `ubuntu-latest` (free) | GitHub Pages (`<user>.github.io/<repo>`) |
| our Forgejo | self-hosted `cyberpanel-vps` | manual / our pipeline |
| other | none → skipped, user adds own runner | — |

**Primary flow:** canonical lives on Codeberg (builds + deploys itself). Anyone forks on
Codeberg to work easily. GitHub-friends who have free Pages push their fork to GitHub →
CI skips the Codeberg-only steps → builds + deploys locally to their own GitHub Pages.
GitWorkshop is the canonical NIP-34 parent/source; our Forgejo is the backup + deploy pipe.

---

## Design decision (settled)

**2 layouts × 3 themes = fully configurable.** Same shared layout+theme system; a theme is just a CSS `:root` variable swap plus minor tweaks, so nothing locks us in.

### Layouts
| Layout | Concept | Mockup |
|--------|---------|--------|
| **Advanced** | Sidebar explorer — persistent left nav (apps/bots/categories), content right. Best for deep-browsing a big catalog. | `05-sidebar.html` |
| **Simple** | Standard grid — clean terminal/compact grid. Lean default. | `03-vector-terminal.html` |

### Themes (shared across both layouts)
| Theme | Palette | Mockup |
|-------|---------|--------|
| **Tokyo Night** | dark, blue accent | `01-tokyo-night.html` |
| **Sakura Mochi** | rose/pink, rounded | `02-sakura-mochi.html` |
| **vectorapp.io** | monochrome + green (terminal look) | `03-vector-terminal.html` |

- **Default:** Advanced layout + Tokyo Night
- **Optional:** user picks Simple layout or another theme
- Vector Terminal design itself is filed as an **optional theme swatch**, not the launch look (we don't copy Vector's identity as our first public face)

---

## Status

- [x] Research how nostrapps.com is built
- [x] Fresh repo dir (`~/hub/nostr-zamrock/`)
- [x] Design mockups (see `mockups/index.html`)
- [x] Pick design direction — 2 layouts × 3 themes (default: advanced + Tokyo Night)
- [x] Zola skeleton building cleanly (Zola 0.23.3)
- [x] Layout+theme system wired to config
- [x] Seed starter content (3 apps + 1 bot)
- [x] Client-side filter (search / platform / category)
- [x] Host-aware CI workflow (`.github/workflows/gh-pages.yml`)
- [x] Contribution template + `CONTRIBUTING.md`
- [x] **Reseed full catalog** — all 72 apps from nostrapps `apps.toml` converted to `[extra]` format
- [x] **Working image handling** — live thumbs kept, dead ones auto-swapped to the app's own domain favicon (Google s2), no broken gallery links shipped
- [x] **Correct bios + links** — descriptions/`url`/`source`/`npub` verified and preserved per entry
- [x] Canonical **`nostr-apps.zamrock.net`** via Codeberg Pages (config + `static/CNAME` + `.forgejo/workflows/codeberg-pages.yml`)
- [ ] Note: Zola 0.23 requires custom front-matter fields under `[extra]` (bare keys silently drop — a 0.23 breaking change we had to work around)
- [ ] Bots + Sites sections populated
- [ ] Add our own nostr radio app + Vector listings (waiting)
- [ ] Trusted-dev pubkey list for GitWorkshop auto-merge
- [ ] Forgejo repo + GitHub mirror + GitWorkshop
- [ ] Deploy `nostr-apps.zamrock.net` (Codeberg Pages + DNS)

---

## Open questions

- Keep hosting separate (`nostr-zamrock.net`) vs. subfolder of `zamrock.net`?
- Do we seed **all 72** apps or curate a smaller starter set?
- Bot repo: standalone repo vs. section in this one?
