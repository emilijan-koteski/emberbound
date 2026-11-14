# Assets and tools

Every asset tool and every asset the project uses, with its licence and commercial-use terms, and whether the asset is AI-generated. Store submission forms may ask for this. `art-src/` holds source art and never ships. Everything in `public/` ships: Vite copies it into the build unchanged.

Rows are added by the story that first uses a tool or adds an asset. Each tool's terms are checked on the vendor's own pages before first use. This is not legal advice.

## Tools

| Tool | Version or plan | Licence and commercial-use terms | Date checked |
| --- | --- | --- | --- |
| Gemini app, Nano Banana Pro (image model) | Google AI Pro, student offer, on a personal Google account; free for about 12 months from sign-up (exact end date not checked), then $19.99 a month unless cancelled | Google claims no ownership of generated content, and no term found limits it to non-commercial use. Whether AI output can be copyrighted at all is uncertain, and nothing here grants exclusivity. Don't use the output to develop AI models, and never present it as human-made. Every image carries SynthID and Content Credentials. The Media Watermark setting is on, but no visible mark appeared on any download. Details under Tool notes. | 2026-11-14 |

### Tool notes

#### Gemini app, Nano Banana Pro

Checked 2026-11-14 on Google's own pages. Facts marked *(developer)* come from the developer's account, not from a page.

- **Plan** *(developer)*:
  - Google AI Pro through the student offer, on a personal Google account.
  - The offer runs about 12 months from sign-up. The exact end date wasn't checked.
  - After it ends, the plan converts to the regular price unless cancelled. Renewing is the developer's call.
  - The $19.99 a month comes from the tools decision of 2026-11-13 and a third-party summary. It wasn't re-checked on Google's pages, and it may differ by country.
- **Student offer terms** (checked 2026-11-14):
  - Google AI plans page, student footnote: "Available to eligible students." "Not available on school-issued accounts." "Individual use only." "Student offers are valid for up to 4 years and may automatically renew at the standard monthly price." "Student Special Offer and Combined Google and YouTube Offer terms apply." <https://one.google.com/about/google-ai-plans/>
  - Google One Help, "Claim a Google One student offer": a personal Google account is required, and "University or school accounts aren't eligible". Re-verification happens "usually every 12 months, for up to 4 consecutive years". <https://support.google.com/googleone/answer/17422238>
  - Neither page says anything about commercial or non-commercial use of what the plan generates.
  - "Individual use only" most likely means the plan isn't shared with other people. That reading is a guess.
  - The offer terms page itself (<https://one.google.com/offer/studentoffer6>) didn't load in a fetch and wasn't read.
  - Which form of the offer this account has isn't recorded. Google's pages now describe a free Google AI Pro year for US students, a 12-month Google AI Plus trial elsewhere, and a discounted Pro plan.
- **Ownership:**
  - Google Terms of Service, effective 30 July 2026: "Google won't claim ownership over that content." and "Your content remains yours, which means that you retain any intellectual property rights that you have in your content."
  - <https://policies.google.com/terms>
  - That means Google claims nothing. It doesn't mean the developer holds protectable rights: whether AI-generated images can be copyrighted is uncertain, and nothing grants exclusivity. Similar output could be generated for someone else.
- **Commercial use:**
  - The Terms of Service carry no restriction on commercial use of generated content. Their "may not copy, modify, distribute, sell, or lease" clause covers Google's services and software, not the user's content.
  - The Generative AI Additional Terms (last modified 9 August 2023) "no longer apply, unless you're a business partner with a signed agreement that references these terms": <https://policies.google.com/terms/generative-ai>
- **Restrictions that matter here:**
  - The Terms of Service list as prohibited conduct "using AI-generated content from our services to develop machine learning models or related AI technology" and "misleading others into thinking that generative AI content was created by a human".
  - The Generative AI Prohibited Use Policy (last modified 17 December 2024) bans "Misrepresenting the provenance of generated content by claiming it was created solely by a human, in order to deceive" (4.5), and content that "Violates the rights of others, including privacy and intellectual property rights" (1.6): <https://policies.google.com/terms/generative-ai/use-policy>
  - In practice: this file records which assets are AI-generated. The game and its store pages disclose AI use wherever a store or page requires it, and never present AI-made work as human-made.
  - **Open, for story 2.1:** the concept image goes to Tripo, another AI service, in story 2.2. If Tripo's terms let it use uploads to train or improve its models, that could count as "using AI-generated content from our services to develop machine learning models". Story 2.1 settles this when it checks Tripo's terms, before any upload.
- **Human review and training:**
  - Gemini Apps Privacy Hub (last updated 26 October 2026): "Google uses your activity to provide, develop, and improve its services (including training generative AI models)".
  - With Keep Activity on, an uploaded "photo or video is used to improve Google services with the help of human reviewers".
  - "Reviewed chats are retained for up to three years."
  - With Keep Activity off, or in a temporary chat, chats are "retained with your account for 72 hours", and "Temporary chats are not used to train Google's AI models."
  - <https://support.google.com/gemini/answer/13594961>
  - **Setting chosen** *(developer, 2026-11-14)*: Keep Activity **on**. Prompts and uploaded reference images may be used for training and read by reviewers. Nothing confidential goes into them.
- **Watermarks:**
  - "Manage watermark settings in Gemini Apps": the Media Watermark setting (Settings › Media Watermark) "controls visible watermarks across all visual media you create with Gemini".
  - Only India, South Korea and Vietnam are named as needing AI Ultra to see the setting. A search-result snippet of the same page also excluded work and school accounts, but the fetched page didn't say so.
  - "All AI-generated media created or edited with Gemini Apps includes an invisible SynthID watermark", and "Gemini Apps include Content Credentials (C2PA) metadata". The setting doesn't affect either.
  - <https://support.google.com/gemini/answer/17405358>
  - Verifying an image: upload it to gemini.google.com and ask whether Google AI made it. <https://support.google.com/gemini/answer/16722517>
  - **Setting chosen** *(developer, 2026-11-14)*: the setting was offered on this account, and the developer turned the visible watermark **on**.
  - Even so, none of the six downloads shows a visible mark: both bottom corners of each were checked at full resolution. Why is unknown.
  - If a mark ever appears, it stays on the references, which never ship, and is cropped out of the concept before that goes to Tripo (tools decision 2026-11-13, T7; story 2.2).
- **Budget:**
  - The plan's included use only, at most 5 generations or edits per kept image (GDD, Dependencies, Tool budgets).
  - No top-up, API spend or plan upgrade without the developer's approval.

## Assets

| File | Tool | Licence | AI-generated | Prompt | Attempts | Date |
| --- | --- | --- | --- | --- | --- | --- |
| `art-src/reference/hero-sheet-dark-fantasy.jpeg` | Gemini app, Nano Banana Pro | Gemini row, Tools | yes | P1, then edit (attempt 2) | 2 | 2026-11-14 |
| `art-src/reference/hero-sheet-comic.jpeg` | Gemini app, Nano Banana Pro | Gemini row, Tools | yes | P2 | 1 | 2026-11-14 |
| `art-src/reference/hero-sheet-mix.jpeg` | Gemini app, Nano Banana Pro | Gemini row, Tools | yes | P3 | 1 | 2026-11-14 |
| `art-src/reference/emberwood-key-art-dark-fantasy.jpeg` | Gemini app, Nano Banana Pro | Gemini row, Tools | yes | P4 | 1 | 2026-11-14 |
| `art-src/reference/emberwood-key-art-comic.jpeg` | Gemini app, Nano Banana Pro | Gemini row, Tools | yes | P5 | 1 | 2026-11-14 |
| `art-src/reference/emberwood-key-art-mix.jpeg` | Gemini app, Nano Banana Pro | Gemini row, Tools | yes | P6 | 1 | 2026-11-14 |

Reference images: generated once in story 0.4 to choose the style. They never ship. They are kept exactly as downloaded, with no re-encoding.

- Each file holds a Content Credentials (C2PA) block: `strings <file> | grep urn:c2pa` finds 28 to 98 matches per file.
- SynthID can't be read locally and wasn't verified. Google's check is to upload an image to gemini.google.com and ask whether Google AI made it; that is an optional step for the developer.
- No visible watermark appeared on any of them, although the setting was on.

## Prompts

Prompts as run in the Gemini app, with any follow-up edit messages. Asset rows cite them by ID.

### P1: hero sheet, stylised dark fantasy

Attach: nothing.

> A single full-body concept illustration of an original character named Rowan, standing in a neutral pose and facing the viewer, on a plain light grey background. Rowan is a small cursed warrior turned into a horned ember-beast, clearly not an ape: upright on two legs, with two arms and a human-shaped body about three heads tall. His skin is charcoal black, cracked with glowing orange seams. Two bone horns sweep back from his brow. A furnace glow burns in the middle of his chest, and his eyes are ember-bright. A torn red woodsman's scarf hangs around his neck, the last trace of the man he was. His expression is determined, not monstrous. Style: stylised dark fantasy illustration, with simple, bold, flat shapes, soft gradients, no ink outlines, and a cold palette of deep teal and plum in the shadows. Only this one figure: no extra views, no turnaround, no labels, no text, no lettering, no logo. Portrait format, 3:4.

Edit, attempt 2 (same chat):

> Keep the same character, art style, colours, glowing seams, chest glow, eyes and torn red scarf, but change his proportions. Make him a small, compact game hero with a large head, so that his whole body, from the top of his head to his feet, is only about three heads tall. Make him leaner and less bulky, with shorter arms whose hands hang at hip height, so he reads as a cursed man and not an ape or a brute. Make the two bone horns sweep backward over his head instead of curving up and out. Keep his expression determined but not grim or brutish. Dress him in a pair of worn, dark woodsman's trousers in muted cool tones, torn at the knees and ragged at the shins, held up by a plain belt, with bare clawed feet. Same plain light grey background, same neutral standing pose, facing the viewer. No text. Portrait format, 3:4.

### P2: hero sheet, comic illustration

Attach: the kept P1 image.

> The attached image shows Rowan, an original character. Use it only for Rowan's design: keep his horns, scarf, trousers, body proportions, glowing seams, chest glow and eyes exactly the same. Redraw him in a new style as a single full-body concept illustration, standing in a neutral pose and facing the viewer, on a plain light grey background. Rowan is a small cursed warrior turned into a horned ember-beast, clearly not an ape: upright on two legs, with two arms and a human-shaped body about three heads tall, charcoal-black skin cracked with glowing orange seams, two bone horns sweeping back from his brow, a furnace glow in his chest, ember-bright eyes, a torn red woodsman's scarf, worn dark woodsman's trousers torn at the knees and ragged at the shins with a plain belt, and bare clawed feet. His expression is determined, not monstrous. Style: comic-book illustration, with flat colours, banded shading in two or three hard-edged tones, and bold dark ink outlines of varying weight. Only this one figure: no extra views, no turnaround, no labels, no text, no lettering, no logo. Portrait format, 3:4.

### P3: hero sheet, mix

Attach: the kept P1 image.

> The attached image shows Rowan, an original character. Use it only for Rowan's design: keep his horns, scarf, trousers, body proportions, glowing seams, chest glow and eyes exactly the same. Redraw him in a new style as a single full-body concept illustration, standing in a neutral pose and facing the viewer, on a plain light grey background. Rowan is a small cursed warrior turned into a horned ember-beast, clearly not an ape: upright on two legs, with two arms and a human-shaped body about three heads tall, charcoal-black skin cracked with glowing orange seams, two bone horns sweeping back from his brow, a furnace glow in his chest, ember-bright eyes, a torn red woodsman's scarf, worn dark woodsman's trousers torn at the knees and ragged at the shins with a plain belt, and bare clawed feet. His expression is determined, not monstrous. Style: comic-book shading and outlines (flat colours, banded hard-edged shading, bold dark ink outlines) with a cold dark-fantasy palette of deep teal and plum in the shadows. Only this one figure: no extra views, no turnaround, no labels, no text, no lettering, no logo. Portrait format, 3:4.

### P4: Emberwood key art, stylised dark fantasy

Attach: the kept P1 image.

> A cinematic 16:9 widescreen image. The attached image shows Rowan, an original character; use it only for Rowan's design, not for the format, background or pose. Create a side-on view of a 2.5D side-scrolling platformer level, like one gameplay frame with every interface element removed. An old forest at dusk: mossy rock, gnarled trees, wooden ledges, hanging lanterns that cast small pools of warm light, and glowing embers drifting through the air. A clear, flat, walkable ground line runs across the lower part of the frame, broken by one gap, with one raised wooden platform above the ground. Rowan stands small on the ground line, in the lower third of the frame, seen side-on. Layered depth, from front to back: dark silhouetted foreground plants at the edges of the frame, the play area, misty trees in the middle distance, and distant ridges. Warm light comes only from Rowan, the embers and the lanterns; everything else is cool and dim. The mood is dark fantasy. Style: stylised dark fantasy illustration, with simple, bold, flat shapes, soft gradients, no ink outlines, a cold palette of deep teal and plum, soft fog, and a pale cold glow behind the trees. No interface, no HUD, no text, no lettering, no logo. Landscape format, 16:9.

### P5: Emberwood key art, comic illustration

Attach: the kept P2 image.

> A cinematic 16:9 widescreen image. The attached image shows Rowan, an original character; use it only for Rowan's design, not for the format, background or pose. Create a side-on view of a 2.5D side-scrolling platformer level, like one gameplay frame with every interface element removed. An old forest at dusk: mossy rock, gnarled trees, wooden ledges, hanging lanterns that cast small pools of warm light, and glowing embers drifting through the air. A clear, flat, walkable ground line runs across the lower part of the frame, broken by one gap, with one raised wooden platform above the ground. Rowan stands small on the ground line, in the lower third of the frame, seen side-on. Layered depth, from front to back: dark silhouetted foreground plants at the edges of the frame, the play area, misty trees in the middle distance, and distant ridges. Warm light comes only from Rowan, the embers and the lanterns; everything else is cool and dim. The mood is dark fantasy. Style: comic-book illustration, with flat colours, banded shading in two or three hard-edged tones, bold dark ink outlines of varying weight, and one dominant colour for the whole scene, a deep moss green. No interface, no HUD, no text, no lettering, no logo. Landscape format, 16:9.

### P6: Emberwood key art, mix

Attach: the kept P3 image.

> A cinematic 16:9 widescreen image. The attached image shows Rowan, an original character; use it only for Rowan's design, not for the format, background or pose. Create a side-on view of a 2.5D side-scrolling platformer level, like one gameplay frame with every interface element removed. An old forest at dusk: mossy rock, gnarled trees, wooden ledges, hanging lanterns that cast small pools of warm light, and glowing embers drifting through the air. A clear, flat, walkable ground line runs across the lower part of the frame, broken by one gap, with one raised wooden platform above the ground. Rowan stands small on the ground line, in the lower third of the frame, seen side-on. Layered depth, from front to back: dark silhouetted foreground plants at the edges of the frame, the play area, misty trees in the middle distance, and distant ridges. Warm light comes only from Rowan, the embers and the lanterns; everything else is cool and dim. The mood is dark fantasy. Style: comic-book shading and outlines (flat colours, banded hard-edged shading, bold dark ink outlines) with a cold dark-fantasy palette of deep teal and plum, soft fog, and a pale cold glow behind the trees. No interface, no HUD, no text, no lettering, no logo. Landscape format, 16:9.
