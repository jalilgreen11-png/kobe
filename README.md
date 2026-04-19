# Masjid Al-Mumin — Website

A full website for Masjid Al-Mumin, Los Angeles. Built as a clean static site so you can host it for free and edit content without touching code.

---

## What's included

**Pages:**
- `index.html` — Home page with hero, live prayer times, weekend school curriculum slideshow, program preview, events preview, Sheikh Fareed feature, and donate CTA.
- `about.html` — Masjid story and history with a milestone timeline.
- `programs.html` — All weekly classes (Imam Ibn Al-Farooq's Friday/Saturday classes and Ustadh Dawood's Tuesday/Thursday Bulugh al-Maram classes).
- `weekend-school.html` — Full curriculum with images and a registration signup form.
- `events.html` — Upcoming events and newsletter signup.
- `donate.html` — Donation form with preset amounts, donation types, and multiple giving methods.
- `sheikh-fareed.html` — Full biography of Sheikh Abu Mujaahid Fareed Abdullah (rahimahullah).

**Features:**
- Live prayer times from the AlAdhan API (free, no key needed). Currently set to ISNA method for LA. Active prayer is highlighted automatically.
- Auto-advancing slideshow on the home page with the four curriculum cards.
- Scroll-reveal animations on every section.
- Mobile-responsive with a collapsing hamburger nav.
- Islamic geometric patterns and subtle noise texture for depth.
- Green-and-gold palette matching your logo and flyers.

---

## Editing content (no coding)

Everything that changes often is in the `data/` folder as simple JSON. Open these files in any text editor.

### Add or remove a class/program

Open `data/programs.json`. Each program is an object. To add one, copy an existing block, change the values, and save:

```json
{
  "id": "unique-id",
  "title": "Class Title",
  "arabic": "العنوان بالعربية",
  "day": "Every Wednesday",
  "time": "After Maghrib",
  "teacher": "Teacher Name",
  "teacherBio": "Their credentials",
  "description": "What the class covers.",
  "level": "All levels",
  "category": "Fiqh"
}
```

To remove a program, delete its block (including the comma before or after it — JSON is picky).

### Add or remove an event

Open `data/events.json`. Events automatically sort by date and only show upcoming ones — past events drop off on their own.

```json
{
  "title": "Event Name",
  "date": "2026-07-19",
  "time": "6:30 PM",
  "location": "Masjid Al-Mumin",
  "description": "What this event is about.",
  "link": "donate.html"
}
```

Date format is `YYYY-MM-DD`. Leave `link` as `"#"` if there's no specific page.

### Change the announcement bar

Edit the text at the top of `js/layout.js` inside `announcement`:

```js
🕌 Jumu'ah every Friday · Weekend school registration open — <a href="weekend-school.html">Sign up</a>
```

---

## Prayer times

Prayer times come from the **AlAdhan API** (`api.aladhan.com`). It's free, reliable, and used by many masjid sites globally.

**Current config** (in `js/main.js`):
- Location: Los Angeles (34.0522, -118.2437)
- Method: ISNA (method=2)

If you want to change the calculation method, edit `PRAYER_METHOD` in `js/main.js`:
- 2 = ISNA
- 3 = Muslim World League
- 4 = Umm al-Qura (Makkah)
- 5 = Egyptian
- 7 = University of Islamic Sciences, Karachi

Full list at https://aladhan.com/prayer-times-api.

---

## Hosting (free)

This site is fully static — no server required. Best free options:

### Option 1: Netlify (easiest)
1. Zip the whole folder.
2. Go to https://app.netlify.com/drop and drag the folder in.
3. Done. You get a live URL in seconds.
4. Connect a custom domain (masjidalmumin.org) in Netlify settings.

### Option 2: GitHub Pages
1. Create a repo on GitHub, push this folder.
2. Go to Settings → Pages → deploy from main branch.
3. Site is live at `yourusername.github.io/repo-name`.

### Option 3: Vercel
Same as Netlify — drag and drop, or connect GitHub repo.

---

## Making forms actually work

The signup and donate forms currently just log to the console. To make them send real data, pick one:

### Easiest: Formspree
1. Sign up at https://formspree.io (free tier is fine).
2. Get your form endpoint URL.
3. In `weekend-school.html`, replace the form's `onsubmit` with `action="https://formspree.io/f/YOUR_ID" method="POST"` and remove the custom JS.

### Alternative: Netlify Forms
If you host on Netlify, just add `netlify` as an attribute on each `<form>` tag. Submissions show up in your Netlify dashboard.

### Donations: LaunchGood, Stripe, or PayPal
For the donate form, you'll want real payment processing:
- **LaunchGood** — Muslim-run, charges a small fee, handles zakah/sadaqah tracking. Recommended for masjids.
- **Stripe** — Lower fees but requires setup. Use Stripe Checkout for the simplest integration.
- **PayPal Giving Fund** — Free for registered 501(c)(3) nonprofits.

Replace the `handleDonate` function in `donate.html` with a redirect to your payment processor.

---

## Adding images

Drop new images in the `images/` folder. Then reference them in the HTML like `<img src="images/your-image.jpg">`.

**Recommended sizes:**
- Hero images: 1600x1200 or larger
- Curriculum tiles: already sized correctly
- Gallery photos: 1200x900 minimum
- Optimize with https://squoosh.app before uploading to keep the site fast.

---

## File structure

```
masjid-almumin/
├── index.html              ← Home page
├── about.html              ← Masjid history
├── programs.html           ← All classes
├── weekend-school.html     ← Weekend school + signup
├── events.html             ← Events + newsletter
├── donate.html             ← Donation page
├── sheikh-fareed.html      ← Sheikh's biography
├── css/
│   └── style.css           ← All styling
├── js/
│   ├── main.js             ← Prayer times, slideshow, content loaders
│   └── layout.js           ← Shared header + footer
├── data/
│   ├── programs.json       ← EDIT to add/remove classes
│   └── events.json         ← EDIT to add/remove events
└── images/                 ← All photos and graphics
```

---

## Colors and fonts

If you want to tweak the look, all colors are CSS variables at the top of `css/style.css`:

```css
--green-deep: #0b3d2e;   /* main dark green */
--gold: #c9a24b;          /* accent gold */
--cream: #fbf7ec;         /* soft background */
```

Fonts loaded from Google Fonts:
- **Cormorant Garamond** — headings (italic style)
- **Cormorant Infant** — body text
- **Amiri** — Arabic text
- **Reem Kufi** — UI labels and uppercase text

---

## Next ideas (when you have time)

- **Jumu'ah khutbah archive** — page with audio/YouTube links.
- **Madhhab-style Qur'an verse of the week** — editable JSON, rotates on home page.
- **Ramadan iftar RSVP system** — another form.
- **Sheikh Fareed's audio lectures** — dedicated lecture library.
- **Admin login** — simple password-protected page to edit JSON through a UI instead of editing files directly. (This would need a small backend like Netlify Functions or Cloudflare Workers.)

---

Bismillah — may Allah accept this work and make it sadaqah jariyah for whoever built it and whoever benefits from it.
