# The Agentic Radiologist — redesign specification

**Date:** 2026-09-16
**Site:** `agenticradiologist.netlify.app` (Netlify, static, no build step)
**Baseline commit:** `99e50c2` — current live site, preserved as rollback
**Status:** awaiting review

---

## 1. Purpose

Rebuild the personal site as **The Agentic Radiologist** — a clinician's
first-person resource for AI literacy in medicine.

The site is no longer a personal portfolio about "two careers". It is a
**teaching surface with a named persona**. The positioning is peer-to-peer, not
institutional:

> A consultant radiologist who runs open-source models on hardware he owns, and
> would rather colleagues got to use these tools than not.

### Voice rules (hard constraints)

| Do | Don't |
|---|---|
| "I am not an educator — I just didn't want to be the only one using it." | "AI literacy for clinicians, taught by…" |
| Peer showing peers | Authority dispensing a curriculum |
| "Most clinicians I work with have never opened one of these." | "Medical staff are lacking in AI skills." |
| Concrete productivity: hours back, admin, references | Clinical outcome claims |
| Optimism about AI-augmented humans | Hype, or doom |
| Sceptical of vendors and of the models themselves | Selling anything |

**Name policy:** Alex Yap is downplayed as an individual. The brand is *The
Agentic Radiologist*. The name appears only as a small byline and in links to
LinkedIn and Instagram (`@agenticjourney`). No headshot, no CV framing.

### Beliefs to make explicit on the page

1. Open-source weights over closed APIs.
2. Local inference on hardware you own — not rented.
3. Inspectable, auditable, nothing phones home.
4. Patient data never enters these tools.
5. AI-augmented humans, not AI-replaced ones.

---

## 2. Audience

Primary: clinicians and clinical staff who have never used an agentic tool.
Secondary: radiologists reading protocol/QI work. Tertiary: technical visitors
checking whether the claims hold up.

---

## 3. Scope

**In scope — three pages (static, no build step):**

| Page | Purpose |
|---|---|
| `index.html` | The scroll movie, beliefs, hardware, builds, writing |
| `learn.html` | **New.** AI-literacy hub: explainers, the interactive exercise, glossary |
| `blog.html` | Existing, restyled, still driven by `posts.json` |

**Out of scope (YAGNI):** no CMS, no comments, no search, no analytics, no
newsletter backend change (Buttondown form stays as-is, still stubbed), no
talks/teaching page, no accounts, no dark/light toggle removal — **keep both themes**.

---

## 4. Design language

### 4.1 Tokens — adopted verbatim from `dixonlspine`

The decision is to **consolidate a system already owned**, not invent one.
`dixonlspine` already uses `#04060a` with Inter + JetBrains Mono.

```css
--bg:        #04060a;   --bg2:       #080b12;
--surface:   #0d1117;   --elevated:  #151a24;
--card:      #161c28;   --card-hi:   #1c2333;
--border:    #1e2536;   --border2:   #2a3148;
--text:      #cbd5e1;   --dim:       #5a6478;
--bright:    #ffffff;

/* accents */
--gold:      #e8a62e;   /* PRIMARY — annotation, HUD, CTA, active state */
--teal:      #2dd4bf;   /* SECONDARY — links, quiet emphasis, continuity with the live site */
--cyan:      #22d3ee;   /* data viz only, sparingly */
--green:     #34d399;   /* correct / success */
--red:       #f87171;   /* error, and the "model was wrong" reveal */
--blue:      #5ba0ff;   /* inline prose links only */
```

Light theme: derives from the same set, `--paper #f8fbfa`, `--ink #173b3a`
(borrowed from `primemri`). On light, the accent is **`#8a5a00`**, not `--gold`
(see §12 — gold on paper measures 2.03:1 and fails).

**Two token corrections applied on adoption** (measured in §12):
`--dim` becomes **`#8f9aad`** (the inherited `#5a6478` fails AA at 3.41:1), and
the light-theme accent becomes **`#8a5a00`**.

### 4.2 Type

- **UI / headings / prose body:** system stack, Inter first (graceful if absent).
  Zero webfont cost — this is the existing site's discipline and it stays.
- **Mono:** JetBrains Mono, then `ui-monospace`/SF Mono/Menlo.
  **One deliberate exception:** self-host a **latin-subset JetBrains Mono woff2
  (~35 KB)**. The console aesthetic depends on the mono face being *actually
  monospaced and consistent*; the existing `dixonlspine` declares
  `font-family: Inter'` with a stray quote and silently falls back. Fix that.

### 4.3 Motion

Scroll-driven, vanilla JS, no libraries. All motion honours
`prefers-reduced-motion: reduce` by rendering the 8 beats **stacked statically,
no sticky, no scroll-jacking.**

---

## 5. `index.html` — the scroll movie

**Eight beats**, sticky viewport inside a ~620 vh track, driven by scroll
position. HUD persists throughout: recon bar tracks scroll, series counter and
name advance, WW/WL steps per beat.

| # | Beat | Content | WW/WL |
|---|---|---|---|
| 1 | COLD OPEN | amber scanline sweep; `~$ whoami` types | 0/0 |
| 2 | BOOT | HUD brackets arm; "Reading scans is the day job." | 0/0 |
| 3 | TITLE | "I read scans. I run models on my own hardware. *Mostly I show colleagues what these do.*" + belief chips | 400/40 |
| 4 | SPECTRAL | **DECT before/after** — conventional vs fusion, as "change the energy, the same scan says something new" | 700/70 |
| 5 | THE GAP | "The gap isn't talent." — honest framing of why colleagues haven't adopted | 900/120 |
| 6 | MEASURED | counters: RTX 2080 (old GPU) · M1 Max 64 GB · 0 bytes sent away · 100% local | 900/120 |
| 7 | PRACTICE | productivity list: papers triaged, one-paragraph summaries, admin drafting, references, rosters | 1200/200 |
| 8 | RECONSTRUCTION | zoom-to-pixel; "I'm not an educator. I just didn't want to be the only one using it." + CTAs | 1200/200 |

**Transitions:** zoom-through-the-scan at each of the 7 cuts (amber volume scales
0.55× → 9×, dissolves). Camera drift on the whole stage.

**Risk — scroll-jacking cost.** 620 vh is ~6 screens before ordinary content.
Mitigations, all required:
- a persistent **Skip** affordance that jumps to `#beliefs`;
- track length capped at 620 vh;
- reduced-motion renders statically;
- the movie is the *only* scroll-jacked region.

**Below the movie, in normal flow:**
`#beliefs` (five beliefs) → `#hardware` (honest numbers, no vanity specs) →
`#builds` (cross-links, §7) → `#writing` (3 featured posts from `posts.json`) → footer.

---

## 6. `learn.html` — AI-literacy hub

Plain-English explainers, each short, each ending in "where this fails".
No clinical claims, no patient data, no vendor content.

1. What a language model actually is — and is not
2. Local versus cloud: what genuinely differs (cost, privacy, capability, latency)
3. What "agent" means without the hype
4. **Where these tools fail** — confident wrongness, the central lesson
5. Running it yourself: honest numbers from a 2080 and an M1 Max
6. Why patient data never goes near these tools
7. Prompting as a skill rather than a trick
8. **The interactive exercise** (§8)
9. Glossary (token, context window, quantisation, RAG, agent, fine-tune, weights, inference)

**The one thing competitors cannot copy:** every explainer is written by someone
who actually reads the scans, and each one names its own failure mode.

---

## 7. `#builds` — cross-linking the estate

All eight Netlify builds, verified live via the Netlify API:

| Build | Link | Note |
|---|---|---|
| dectbme | `dectbme.netlify.app` | DECT bone marrow oedema learning hub |
| dixonlspine | `dixonlspine.netlify.app` | Abbreviated lumbar spine protocol |
| digitalfirst3dlab | `digitalfirst3dlab.netlify.app` | Digital-first 3D workflow |
| radart | `radart.netlify.app` | Rad-ART: 3D models + AR |
| radroster | `radroster.netlify.app` | Roster viewer |
| primemri | `primemri.netlify.app` | MRI preparation, WebXR |
| wh3dlab | — | **404 — needs attention before linking** |
| startling-biscuit-6d03a5 | — | **live duplicate of primemri under a default name — tidy up** |

Two builds on this list (`primemri`, `wh3dlab`) are **absent from the current
site's "Things I've built"** — the new page fixes that gap.

**Presentation:** a monospace index, not marketing cards. Each entry: name, one
line, live link. Grouped as *Radiology* / *Education & 3D* / *Tools*.

---

## 8. The interactive exercise (Learn hub)

Built on the annotated foot radiograph (`assets/img/foot-film-*.{jpg,webp}`).

> The tool drew three boxes. Two are real. One is its mistake.

- Boxes are referenced **by position** (upper-left / upper-right / lower-left),
  because the boxes are burned into the photograph and cannot be restyled or
  cleanly removed. No overlay is drawn — this avoids double-boxing.
- Interaction: pick a box → reveal → per-box verdict, correct/incorrect feedback.
- **Open item:** the answer key must match the real case. Awaiting Alex.
- **Framing required on the page:** illustrative example of the *kind of output*
  these tools produce — not a validated device, not a claim about a product.

---

## 9. Asset pipeline

### 9.1 Already done

Phone photographs processed, EXIF verified **absent on both**:

| File | Size | Note |
|---|---|---|
| `assets/img/chest-film-{lg,md}.{jpg,webp}` | 1080×1440 / 720×960 | hero plate |
| `assets/img/foot-film-{lg,md}.{jpg,webp}` | 1080×1923 / 720×1282 | interactive exercise |

Pipeline: grayscale → 0.7× downscale → light Gaussian → autocontrast.
Verified: mean luminance 122 / 102, <3% clipping either end.
Originals stay local and **gitignored**.

### 9.2 To curate from the estate

Curated, **not mirrored**. The build sites own the depth; the main site borrows a
few images. Target ≤ 14 images, ≤ 80 KB each after optimisation.

| Use | Source | Verified |
|---|---|---|
| SPECTRAL beat before/after | `dectbme` case-01 `full-stacks/conventional_coronal/slice-NNN.jpg` and `dect_fusion_coronal/slice-NNN.jpg` | 60 + 60 slices, ~44/67 KB |
| DECT preview pairs | `dectbme` `previews/l1-bone.jpg` / `l1-bme.jpg`, `sag-bone` / `sag-bme` | referenced in JS; confirm paths |
| Dixon 4-contrast comparison | `dixonlspine` `/case2/sag_{in,fo,wo,t1}_…Img{N}.jpg` | 4 × 19 slices, ~23 KB |
| 3D / XR render | `digitalfirst3dlab` `/generated/digital-xr-selective-jig-hero.png` | 1.5 MB — must be resized + converted |
| AR visualisation | `radart` `/examples/images/hero-visualisation.jpg` | 118 KB |

**Optimisation rules for every borrowed image:** re-encode to WebP (primary) with
a JPG fallback, cap at the largest size actually used, explicit `width`/`height`
to prevent layout shift, `loading="lazy"` below the fold, `decoding="async"`.
Long-term these should be **re-downloaded at source and committed** rather than
hot-linked — hot-linking couples this site to the other sites' deploys.

**Governance note (raised, accepted):** all images come from the author's own
already-public builds and are stated anonymised. Re-publication on a new domain
remains the author's call.

---

## 10. Graphics system (hand-built SVG)

No stock, no raster icons. Drawn to the console palette, `currentColor`-aware,
theme-reactive, animatable, ~1 KB each.

- **Brand mark:** K-edge spectral curve (chosen), with the reticle as an
  alternative if the K-edge fails at 16 px favicon size. **Decide at build time
  by testing at 16 px.**
- **Section glyphs (6):** radiology cross-section, agentic node graph, explaining,
  own hardware, open weights, no patient data.
- **Explainer diagram:** attenuation versus energy with the iodine K-edge at
  33 keV annotated and 40/70/140 keV markers — the canonical Learn-hub figure.
- **Favicon:** SVG data-URI in the brand mark, replacing the current teal `a`.

Canva's role is limited to **Open Graph / social preview cards** and post headers.
The generated Canva infographic candidates were rejected as in-page furniture:
corporate-vector style, incompatible with the console aesthetic, 300 KB+ flat PNGs.

---

## 11. Technical constraints

- Plain HTML + CSS + vanilla JS. **No build step, no dependencies, no framework.**
- Static deploy to Netlify (`agenticradiologist.netlify.app`).
- New local git repo exists at baseline `99e50c2`. **Deployment remote is not yet
  configured** — must be added before publish.
- `posts.json` continues to drive both post lists; `script.js` `FALLBACK_POSTS`
  must stay in sync.
- Keep: theme toggle with `localStorage`, OS-preference following, skip link,
  focus-visible styling, semantic landmarks.
- Remove: the 3D card tilt (`initTilt`) — it fights the HUD precision. The scroll
  progress bar is **repurposed** as the recon bar.

---

## 12. Performance and accessibility budgets

- No layout shift on images (explicit dimensions everywhere).
- Total added image weight on first load **< 250 KB**; hero image ≤ 80 KB.
- First-load JS remains a single small file; no third-party scripts.
- Every motion path has a reduced-motion equivalent.
- The interactive exercise is keyboard-operable with live-region feedback.
- **Contrast — two defects found in the inherited tokens (measured, not assumed):**

  | Pair | Ratio | Verdict |
  |---|---|---|
  | `--gold #e8a62e` on `--bg #04060a` | 9.58:1 | PASS (AAA) |
  | `--teal #2dd4bf` on `--bg` | 10.89:1 | PASS (AAA) |
  | `--text #cbd5e1` on `--bg` | 13.66:1 | PASS (AAA) |
  | **`--dim #5a6478` on `--bg`** | **3.41:1** | **FAILS AA for small text** |
  | **`--gold #e8a62e` on light `--paper #f8fbfa`** | **2.03:1** | **FAILS badly** |

  - **Fix 1:** `--dim` is inherited from `dixonlspine` and is non-compliant for the
    small monospace labels it is used for. Replace with **`#8f9aad` (7.14:1)** —
    or `#7d8899` (5.65:1) as the minimum acceptable. Applies to the whole estate.
  - **Fix 2:** gold cannot be used for text on the light theme. Use
    **`#8a5a00` (5.69:1)** as the light-theme accent; note that `radroster`'s
    existing `--amber #c47b21` also fails at 3.25:1.
  - `--line`/hairline borders are decorative and exempt from text contrast.
- Keep the scroll movie's HUD non-essential: content must be readable with CSS/JS
  disabled or reduced motion enabled.

---

## 13. Open items

1. **Typos** — Alex has seen typos on the prototype. Not yet identified. A
   spellchecker is unavailable on this machine; the strings were reviewed manually
   and a doubled-word pass over `index.html`, `blog.html`, `posts/*.html` and
   `posts.json` found nothing. **Needs Alex to name them.**
2. **Answer key** for the three boxes in the interactive exercise.
3. **`wh3dlab` 404** — fix or drop from the builds list.
4. **`startling-biscuit-6d03a5`** — duplicate of `primemri` on a default subdomain.
5. Confirm the intended framing of the box exercise is "the kind of output these
   tools produce", not the author's own model.
6. ~~Deployment remote for GitHub Pages.~~ Resolved: Netlify (`agenticradiologist`).
7. Favicon mark: K-edge versus reticle, decided by a 16 px test.

---

## 14. Risks

| Risk | Mitigation |
|---|---|
| 620 vh scroll-jack annoys repeat visitors | Skip affordance; capped length; reduced-motion static |
| Borrowed images hot-linked → coupled deploys | Commit optimised derivatives locally |
| Estate accent drift (6 sites, 6 palettes) | Adopt `dixonlspine` tokens; document them once |
| Mono webfont adds weight | One subsetted woff2, ~35 KB, latin only, `font-display: swap` |
| AI-literacy content drifting into clinical claims | Every explainer names its own failure mode; no patient data, no outcomes |
| Scope creep into a 5-page platform | Hard stop at 3 pages |

---

## 15. Deployment

1. Add the GitHub remote to the new local repo.
2. Deploy `main` → Netlify (`agenticradiologist.netlify.app`).
3. Verify HTTPS resolves.
4. Keep baseline `99e50c2` as the rollback.
