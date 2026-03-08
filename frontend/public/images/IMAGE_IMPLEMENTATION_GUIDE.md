# Agriculture Platform – Background Image Implementation Guide

Use this guide to add and maintain agricultural background images across the app.

## Recommended Images

- **Hero / Dashboard:** Wheat fields, rice paddies, farmer silhouettes at dawn/dusk  
- **Cards / Sections:** Light crop patterns, soil texture (very low opacity)  
- **AI Chat:** Subtle crop or field pattern  
- **Profile:** Optional soft gradient overlay

Use **light, high-key** images so they stay readable at **opacity 0.05–0.15**.

## 1. Local Images (public/images)

1. Add files under `public/images/`, e.g.:
   - `hero-farmer.jpg` – hero/parallax
   - `wheat-field.jpg` – dashboard/page background
   - `pattern-wheat.svg` – repeating pattern for cards
   - `rice-paddy.jpg` – alternate section background

2. Reference in components:
   - **Inline style:**  
     `style={{ backgroundImage: 'url(/images/hero-farmer.jpg)' }}`
   - **Tailwind (if configured):**  
     `className="bg-hero-farmer"` after adding to `tailwind.config.js` `backgroundImage`.

3. **Opacity:** Wrap the area in a div and use a pseudo-element or overlay:
   ```jsx
   <div className="relative">
     <div className="absolute inset-0 bg-cover bg-center opacity-[0.08]" style={{ backgroundImage: 'url(/images/wheat-field.jpg)' }} />
     <div className="relative z-10">{/* content */}</div>
   </div>
   ```

## 2. Unsplash API (optional)

For dynamic or rotated hero images:

1. Get an API key from [Unsplash Developers](https://unsplash.com/developers).
2. Store the key in `.env`:  
   `VITE_UNSPLASH_ACCESS_KEY=your_key`
3. Fetch in a hook or page:
   ```js
   const url = `https://api.unsplash.com/photos/random?query=wheat+field&client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`;
   const res = await fetch(url);
   const data = await res.json();
   const imageUrl = data.urls?.regular;
   ```
4. Use `imageUrl` in `backgroundImage` and keep opacity low (e.g. 0.06–0.12).

**Suggested queries:** `wheat field`, `rice paddy`, `farmer silhouette`, `agriculture india`, `crop harvest`.

## 3. Current Usage in This Project

- **Dashboard (logged out):** Hero background via Unsplash URL (wheat field), opacity ~0.06.
- **Dashboard (logged in):** Same image, opacity ~0.04.
- **Markets / Schemes / Profile:** Solid cream/white; optional pattern from `public/images/pattern-wheat.svg` or similar.
- **AI Chat:** Very faint crop image (Unsplash), opacity ~0.04.

To switch to local files, replace the Unsplash URLs in:
- `src/pages/Dashboard.jsx`
- `src/pages/AIChat.jsx`  
with `url(/images/your-file.jpg)` and keep the same opacity classes.

## 4. Accessibility and Performance

- **Contrast:** Ensure text and UI remain readable (WCAG). Keep background opacity **≤ 0.15**.
- **Reduced motion:** Avoid animated backgrounds; prefer static images.
- **Performance:** Prefer WebP/AVIF where possible; use responsive `srcset` or `image-set` if you use `<img>`.
- **Lazy load:** For below-the-fold backgrounds, consider loading images only when in view.

## 5. Tailwind Config Snippets

In `tailwind.config.js` under `theme.extend.backgroundImage`:

```js
'hero-farmer': 'url("/images/hero-farmer.jpg")',
'wheat-field': 'url("/images/wheat-field.jpg")',
'pattern-wheat': 'url("/images/pattern-wheat.svg")',
```

Then use: `bg-hero-farmer`, `bg-wheat-field`, `bg-pattern-wheat` and control opacity with `opacity-[0.08]` (or similar) on a wrapper.
