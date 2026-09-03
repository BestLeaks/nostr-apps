+++
title = "ZamZam"
description = "ZamRock Radio's members-only Nostr music player — now-playing, likes/dislikes as kind-7s, leaderboards, and promo shares, all signed by your own key."

[extra]
categories = ["music", "radio", "player"]
platforms = ["web"]
npub = "npub1zamrock"
source = "https://git.zamrock.net/ZamRock-Radio/nostr-radio-app"
thumb = "/zamzam-icon.png"
url = "https://nostr.zamrock.net"
gallery = ["/zamzam-icon.png", "/card.png"]
features = [
  "Live now-playing from Icepick",
  "Like/dislike the stream as Nostr kind-7s",
  "User and track leaderboards",
  "One-tap promo shares to Nostr / Bluesky / X / Mastodon",
  "Runs entirely on a single Cloudflare Worker",
]
+++

ZamZam is ZamRock Radio's members-only Nostr player at nostr.zamrock.net. Sign in with any Nostr identity (NIP-07 extension or a pasted key that stays in your browser) to unlock live now-playing, 👍/👎 reactions as kind-7s, leaderboards with album art, and shareable promos. The audio stays public — the login only gates the player UI.