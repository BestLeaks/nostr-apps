# Contributing

Adding an app, bot, or runner to nostr-zamrock is a **one-file change**. No
build tools, no local setup, no approvals.

## The steps

1. **Fork** this repo.
2. **Add one file** — copy `content/apps/_template.md` to
   `content/apps/<your-app>/index.md` and fill it in.
3. **Open a pull request.** Done.

Once merged, a bot or maintainer runs a quick sanity check and it's live.

## The fields

| Field | Required | Notes |
|-------|----------|-------|
| `title` | ✅ | Display name |
| `description` | ✅ | One line, what it does |
| `categories` | ✅ | Pick from the list in the template |
| `platforms` | ✅ | `web ios android desktop linux macos windows server` |
| `thumb` | ✅ | Square icon/logo URL |
| `url` | ✅ | The main link |
| `npub` | ✅ | Starts with `npub1…` |
| `source` | — | Where the code lives |
| `gallery` | — | Screenshot URLs |
| `features` | — | Bullet highlights |

## Notes

- Keep `description` to one sentence.
- Thumbnails should be square and reasonably small.
- Don't add files or fields beyond the template — it keeps PRs clean and
  buildable. If you believe an adjustment should be made please create an issue or discussion

## Preferred hosts

You may make a PR/issue/etc in any of the following repos

https://git.zamrock.net/BestLaw/nostr-apps-deploy/src/branch/main/CONTRIBUTING.md - ideal
https://github.com/BestLeaks/nostr-apps
https://codeberg.org/BestLaw/nostr-apps-zamrock