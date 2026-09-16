# agenticradiologist.io

Personal site for **Alex Yap** — consultant radiologist (MSK, body imaging, DECT, 3D Imaging Lab)
and local-first agentic AI builder. Plain HTML + CSS + vanilla JS. No build step, no dependencies.

## Local preview

```bash
cd agenticradiologist-site
python3 -m http.server 8080
# open http://localhost:8080
```

(`fetch("posts.json")` needs a real server — it won't work over `file://`.)

## 1. Register the domain (Porkbun)

1. Go to [porkbun.com](https://porkbun.com) and search for `agenticradiologist.io`.
2. Add to cart → complete checkout (you'll get a Porkbun account if you don't have one).
3. You'll manage DNS later in the Porkbun dashboard under **Domains → agenticradiologist.io → DNS Records**.

## 2. Push to GitHub

1. Create a new (public) repository on GitHub, e.g. `agenticradiologist`.
2. From the folder containing this README:

   ```bash
   cd agenticradiologist-site
   git init
   git add .
   git commit -m "site: initial version"
   git branch -M main
   git remote add origin git@github.com:YOUR_USERNAME/agenticradiologist.git
   git push -u origin main
   ```

## 3. Enable GitHub Pages

1. Repo → **Settings → Pages**.
2. **Build and deployment → Source**: *Deploy from a branch*.
3. Branch: `main`, folder: `/ (root)`. Save.
4. Your site goes live at `https://YOUR_USERNAME.github.io/agenticradiologist/`.
   (Tip: to get the cleaner `https://YOUR_USERNAME.github.io/` URL, name the repo exactly
   `YOUR_USERNAME.github.io` — but the custom domain below makes this moot.)

## 3b. Free alternative: deploy on Netlify (no domain needed)

Skip steps 2–4 above if you'd rather not buy a domain yet. Netlify hosts static sites
free, with a `*.netlify.app` subdomain and automatic HTTPS:

1. Push the repo to GitHub (step 2), **or** just drag the `agenticradiologist-site` folder
   onto [app.netlify.com/drop](https://app.netlify.com/drop).
2. Done — your site is live at `https://<random>.netlify.app`.
3. (Optional, later) add a custom domain in Netlify → **Domain settings**; it provisions
   the SSL certificate for you. The same `CNAME` / `posts.json` site works unchanged.

## 4. Connect the custom domain (CNAME)

1. The repo root already contains a `CNAME` file with `agenticradiologist.io`. If you renamed
   the repo, edit it accordingly and push.
2. In GitHub Pages settings, scroll to **Custom domain** → enter `agenticradiologist.io` → Save.
   GitHub forces HTTPS automatically; allow up to ~30 min for the certificate.
3. In Porkbun → **DNS Records** for the domain, add the records GitHub tells you
   (GitHub Pages shows them in the Pages settings; the defaults are):

   | Type  | Host | Value                  |
   |-------|------|------------------------|
   | A     | @    | 185.199.108.153        |
   | A     | @    | 185.199.109.153        |
   | A     | @    | 185.199.110.153        |
   | A     | @    | 185.199.111.153        |
   | AAAA  | @    | 2606:50c0:8000::153     |
   | AAAA  | @    | 2606:50c0:8000::154     |
   | AAAA  | @    | 2606:50c0:8000::155     |
   | AAAA  | @    | 2606:50c0:8000::156     |

4. Delete any other A/CNAME records Porkbun created for the apex, wait for DNS to propagate
   (`dig agenticradiologist.io`), and `https://agenticradiologist.io` should work.

## 5. Wire up the newsletter (Buttondown)

1. Sign up at [buttondown.email](https://buttondown.email) (free tier is fine).
2. Create an email; copy the **access code** (or username) from your Buttondown dashboard.
3. In `index.html`, find the form and replace the placeholder:

   ```html
   action="https://buttondown.email/api/emails/subscribe?access_code=YOUR_BUTTONDOWN_USERNAME"
   ```

   …with your real code, e.g. `?access_code=agenticradiologist`. Until this is set, the form
   shows a friendly "this is a stub" message instead of actually subscribing.

## 6. Write a new post

1. Copy an existing file from `posts/` to `posts/your-new-post.html` and edit the content.
   (Keep the layout and the `.seed-note` pattern in mind — but *remove* the seed note on real posts.)
2. Add an entry to `posts.json`:

   ```json
   {
     "title": "Your post title",
     "date": "2026-09-01",
     "excerpt": "One or two sentences. No lorem ipsum.",
     "tag": "your-tag",
     "url": "posts/your-new-post.html"
   }
   ```

3. Commit and push. The home page (featured 3) and `blog.html` pick it up automatically —
   both render from `posts.json` via `assets/script.js`.

## 7. Replace the seed content

The three posts in `posts/` are **seed/sample content** (each says so in a note at the end).
Rewrite them as your own — the layout, `posts.json`, and rendering are the part to keep.
The About section in `index.html` is also editable copy, written from the brief; make it yours.

## Site structure

```
index.html          home: hero, about, pillars, newsletter, featured posts
blog.html           all posts
posts/              one HTML file per post
posts.json          post metadata (drives both lists)
assets/styles.css   all styling, light + dark themes
assets/script.js    theme toggle, scroll reveal, post rendering, newsletter stub
CNAME               custom domain for GitHub Pages
```

Design notes: light/dark theme (follows OS, manual toggle persists in `localStorage`),
`prefers-reduced-motion` respected, system font stacks only (no webfonts), single accent
color (medical teal `#2dd4bf` dark / `#0a756b` light), mobile-first CSS.
