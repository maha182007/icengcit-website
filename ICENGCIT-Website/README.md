# ICENGCIT 2027 — Conference Website

**International Conference on Engineering, Computing & Information Technology**
Hosted by the Department of Computer Science & Engineering, CIT — 2027

---

## 📁 Project Structure

```
ICENGCIT-Website/
├── index.html              # Main HTML — all sections
├── styles/
│   └── styles.css          # Full stylesheet with CSS variables
├── js/
│   └── script.js           # Interactivity + API fetch calls
├── assets/
│   ├── images/             # Conference/campus images
│   ├── logos/              # Institution logos
│   └── icons/              # SVG / PNG icons
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

No build tools required. Open `index.html` in a browser or serve with any static server:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .
```

---

## 🔌 Backend Integration

Three API endpoints are pre-wired in `js/script.js` using the Fetch API.
Replace the placeholder URLs with your actual backend:

| Form | Method | Endpoint |
|------|--------|----------|
| Contact | POST | `/api/contact` |
| Registration | POST | `/api/register` |
| Paper Submission | POST | `/api/submit-paper` |

All comments in `script.js` are marked with `// BACKEND:` for easy search.

**Expected JSON payloads** are documented inline in `script.js`.

---

## 🎨 Color Theme

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#0B1E3C` | Deep Navy — backgrounds |
| `--secondary` | `#1E3A8A` | Royal Blue — cards, sections |
| `--accent` | `#F5B800` | Gold — CTAs, highlights |
| `--bg-dark` | `#060E1F` | Darkest background |

---

## 📦 Deployment

### Static Hosting (Netlify / Vercel / GitHub Pages)
Push to a repo and connect. No config needed.

### With Backend (Node/Python/PHP)
1. Deploy backend to your server
2. Update API base URL in `js/script.js` (search `API_BASE`)
3. Enable CORS on your backend for the frontend domain
4. Serve `index.html` as the entry point

---

## ✏️ Customization Checklist

- [ ] Replace placeholder logos in `assets/logos/`
- [ ] Update committee names in `index.html` (search `<!-- COMMITTEE -->`)
- [ ] Update important dates (search `<!-- DATES -->`)
- [ ] Add keynote speaker photos to `assets/images/`
- [ ] Set real backend endpoints in `js/script.js`
- [ ] Update contact email / phone / address

---

## 📄 License

© 2027 ICENGCIT — Department of CSE, CIT. All rights reserved.
