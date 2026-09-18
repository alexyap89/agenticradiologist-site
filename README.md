# The Agentic Radiologist

**Alexander Yap** — consultant radiologist. I build local-first agentic AI, and this is where the two meet.

I read scans for a living: musculoskeletal and body imaging, dual-energy CT, and the 3D Imaging Lab at Woodlands Hospital (NHG Health) in Singapore, where we turn scans into surgical plans, printed models and quantitative bone characterisation. I build AI after hours — small agent fleets on hardware I own, models that never phone home, and one hard rule that patient data never comes near any of it.

**Live site → [agenticradiologist.netlify.app](https://agenticradiologist.netlify.app)**

---

## What I've built

| Project | What it does |
|---|---|
| **[DECT × BME](https://dectbme.netlify.app)** | Reading bone marrow oedema with dual-energy CT — the pitfalls, and what spectral imaging actually changes about the read |
| **[Dixon L-spine](https://dixonlspine.netlify.app)** | A shorter lumbar spine MRI: one Dixon sequence standing in for several conventional ones, to free scanner time without losing what matters |
| **[Digital First 3D Lab](https://digitalfirst3dlab.netlify.app)** | Photorealistic models and surgical planning for complex cases — digital-first, before anything gets printed |
| **[pRIMed-MRI](https://primemri.netlify.app)** | Patient preparation for abdominal MRI — an interactive 3D scanner room, a 360° walkthrough, guided breath-hold practice and real 1.5 T scanner audio. Runs on desktop and phone with no headset. One of my department's first PREM-based projects |
| **[RadArt](https://radart.netlify.app)** | Augmented reality for imaging review and surgical planning |
| **[RadRoster](https://radroster.netlify.app)** | Radiology roster and workflow tooling — born from a spreadsheet that needed to stop being a spreadsheet |

I also wrote the department's AI literacy course: five chapters running from foundations through governance and tooling to agentic AI, with a blinded pre/post knowledge check and an automated survey pipeline. That repository is private — but it is the work I'm proudest of.

---

## How I build

I work with agentic AI harnesses — Claude Code, OpenCode, Hermes — and I direct them the way I'd direct a junior: precise briefs, review every output, and own the result. I would rather say that plainly than pretend otherwise. Knowing which problems are safe to hand to software, and which are not, is the actual skill.

---

## What I care about

- **Patient data is a trust boundary, not a cost optimisation.** The only boundary that cannot be breached is the one where the data never left the building.
- **Local-first.** Open weights on hardware I own. Auditable, inspectable, and mine.
- **Value-based.** Protocol redesign and sustainability — better imaging, not more expensive imaging.
- **Human in the loop.** I have run blinded silent-deployment audits of clinical AI. The false negatives matter as much as the sensitivity.

---

## Elsewhere

- **LinkedIn** — [linkedin.com/in/alexanderyaprad](https://www.linkedin.com/in/alexanderyaprad/)
- **Instagram** — [@agenticjourney](https://instagram.com/agenticjourney)

---

## Running this site

No build step, no dependencies. Plain HTML, CSS and vanilla JS.

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

(`fetch("posts.json")` needs a real server — it will not work over `file://`.)

## Structure

```
index.html          landing page
blog.html           post index
posts.json          post metadata — add an entry here to publish a post
posts/*.html        individual posts
assets/             styles.css, script.js
docs/superpowers/   design notes
```
