---
title: "Game Brief Addendum: Emberbound"
created: 2026-11-12
updated: 2026-11-12
---

# Addendum: research and supporting detail

Detail that supports the brief but belongs in later documents (GDD, architecture, release planning). Research was done by web search on 2026-11-12. Items marked **verified** were re-checked against the source page in the main session; the rest come from a research pass with the cited links.

## Title check: "Emberbound"

The working title is already used by several games. No trademark databases (USPTO, EUIPO) were searched.

| Title | What it is | Status | Link |
| --- | --- | --- | --- |
| Emberbound | Furry visual novel, Fluffore Studio. Same name on Steam (app 4634770). **Verified.** | Coming soon, demo out | [Steam](https://store.steampowered.com/app/4634770/Emberbound/) |
| EMBERBOUND: Ashes of the Hush | 18+ dark-fantasy action RPG, Oraclysm Games. Closest in tone. | Due on Steam in 2027 | [site](https://oraclysmgames.com/) |
| EmberBound | Pixel-art turn-based JRPG, itch.io | Prologue demo Oct 2026 | [itch](https://vondepew.itch.io/emberbound/devlog/1687050/emberbound-prologue-demo-is-now-available) |
| Emberbound: Dragon Island RPG | Mobile RPG | Released on Google Play | [Play](https://play.google.com/store/apps/details?id=com.game.emberbound) |
| Emberbound: The Hollow Crown | Open-source TypeScript browser beat 'em up. Closest in platform. | v0.31, not store-ready | [GitHub](https://github.com/kadenball/emberbound) |
| Emberbound: Champion of Chains | RPG Maker game | Released on itch.io | [itch](https://masterejokki.itch.io/emberbound-champion-of-chains) |
| Emberborn (similar name) | Three-level student platformer about a baby dragon | Released on itch.io | [itch](https://gbng.itch.io/emberborn) |

## Comparable titles

| Game | Year, price, length | Reception (Steam review count in parentheses) | Relevance | Source |
| --- | --- | --- | --- | --- |
| Toki (remake), Microids | 2018; $29.99 Switch, $19.99 Steam; 20 to 60 min | Metacritic 66. Critics: gorgeous but "over all too quickly", overpriced. Steam 88% positive (386). | The structural model. Shows the risk of a short game at a full price. | [NintendoLife](https://www.nintendolife.com/reviews/nintendo-switch/toki), [Metacritic](https://www.metacritic.com/game/switch/toki), [Steam](https://store.steampowered.com/app/1058320/Toki/) |
| Cuphead | 2017; $19.99; about 11 h | Steam 96% positive | Heroes owe a debt to the devil; shooting is the main attack. Shares the "debt to a dark power" premise. | [Steam](https://store.steampowered.com/app/268910/Cuphead/) |
| Wonder Boy: The Dragon's Trap | 2017; $19.99; about 5 h | Steam 86% positive (1,995), Metacritic 79 | Hero cursed into an animal form; each boss changes his form. Closest precedent for "each seal changes Rowan". | [Steam](https://store.steampowered.com/app/543260/) |
| Bloodstained: Curse of the Moon | 2018; $9.99; about 2 h per run | Steam 92% positive (1,999) | Short, cheap, stage-and-boss platformer with a cursed hero, well received. | [Steam](https://store.steampowered.com/app/838310/Bloodstained_Curse_of_the_Moon/) |
| Ghosts 'n Goblins Resurrection | 2021; $29.99; 4 to 6 h | Steam 74% positive, critics mixed | Modern update of an arcade platformer for the same nostalgic audience. | [Steam](https://store.steampowered.com/app/1375400/Ghosts_n_Goblins_Resurrection/) |
| Wonder Boy: Asha in Monster World | 2021; about $35 to $50; 3 to 5 h | Steam 79% positive (144); "short for the price" | Side view with cel-shaded 3D models, like Emberbound's planned look. | [Steam](https://store.steampowered.com/app/1420080/) |
| Enchanted Portals | 2023; $19.99 | Steam 40% positive (291), OpenCritic 41 | A boss platformer from a two-person team. Called derivative, and "too few levels for the price". | [Steam](https://store.steampowered.com/app/2444350/Enchanted_Portals/) |
| The Dark Queen of Mortholme | 2025; €4.99 Steam, $5.99 GOG; 20 to 40 min | Steam 85% positive (2,058); some said €4.99 is the most it should cost | Same length as Emberbound v1, at a low price, reviewed well. | [Steam](https://store.steampowered.com/app/3587610/The_Dark_Queen_of_Mortholme/) |

**Price by length:** no dataset found. The table above is the evidence.

## Market context

### Steam

- **Refunds:** Steam refunds a game bought within 14 days with under 2 hours played. A 20- to 30-minute game can be finished and refunded. [Valve](https://store.steampowered.com/steam_refunds/)
- **Prices are falling:** the median launch price of the Top 50 Steam games by copies sold fell from $19.50 to $15.64 between Feb 2023 and Oct 2025. [GameDiscoverCo](https://newsletter.gamediscover.co/p/are-steam-game-prices-dropping-and)
- **Most games earn little:**
  - Gamalytic estimates the median 2025 indie Steam release at $347 in revenue. [Superjump](https://www.superjumpmagazine.com/state-of-indie-2026-part-1/)
  - About 40% of 2025 releases did not earn back the $100 listing fee. [DualShockers](https://www.dualshockers.com/steam-games-gross-over-100-thousand-less-than-steam-listing-fees/)

### Browser portals

| Portal | How the developer earns | Constraints that matter for a three.js game |
| --- | --- | --- |
| itch.io | itch.io's cut is set by the developer (10% by default). **Browser games take donations only**; to charge, the game must be listed as "Downloadable". **Verified.** | 1,000 files, 500 MB total, 200 MB per file. [docs](https://itch.io/docs/creators/html5) |
| Poki | 100% of ad revenue from players the developer brings, 50/50 on players Poki sends | Exclusive to Poki among web portals (5 years by default; Steam and app stores are not affected). Ads only through Poki's SDK; no outside network requests. Initial download 5 MB or less, 8 MB total. [terms](https://developers.poki.com/guide/working-with-poki), [requirements](https://developers.poki.com/guide/requirements-quality) |
| CrazyGames | No earnings in "Basic Launch"; ad revenue only after an invitation to "Full Launch" | Initial download 50 MB or less (20 MB or less for the mobile homepage), 250 MB total. [docs](https://docs.crazygames.com/requirements/technical/) |
| Newgrounds | Ad revenue sharing has ended; prizes and jams only | No upload limit found |
| GameDistribution | 33% of net revenue; SDK required | — |

### What solo developers earn from web games

There is little data and none of it is audited.

- From 2018 to 2020, one developer's 8 WebGL games earned €557 from 451k plays on CrazyGames, about €1.20 per 1,000 plays. [source](https://donislawdev.com/earnings-and-statistics-from-my-8-games-android-ios-webgl/)
- A three.js game on CrazyGames earned $0 during Basic Launch (Oct 2026). Its developer had to cut the build from 20.5 MB to 12.4 MB. [source](https://froessell.substack.com/p/15000-from-one-browser-game-the-math)
