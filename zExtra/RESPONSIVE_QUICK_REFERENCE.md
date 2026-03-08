# Responsive Design Quick Reference Card

**Print this or bookmark it for quick access while developing!**

---

## 📱 Breakpoints

| Task | Prefix | Width | When |
|------|--------|-------|------|
| Base styles | (none) | 320px | Mobile phones |
| Small-medium | `sm:` | 640px | Phone landscape |
| Tablet | `md:` | 768px | iPad mini |
| Large tablet | `lg:` | 1024px | iPad, Desktop |
| Desktop | `xl:` | 1280px | Large screens |
| 4K | `2xl:` | 1536px | Ultra-wide |

---

## 🎨 Responsive Classes (Copy & Paste)

### Feature Grid (2 → 3 → 6 columns)
```jsx
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
```

### Quick Actions (2 → 3 → 4 → 7 columns)
```jsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
```

### Card Padding (16px → 20px → 24px)
```jsx
<div className="p-4 sm:p-5 md:p-6">
```

### Button (44px × 44px minimum)
```jsx
<button className="px-4 py-3 md:py-4 min-h-[44px]">
```

### Responsive Text
```jsx
<p className="text-xs sm:text-sm md:text-base">
```

### Form Input (16px base)
```jsx
<input className="w-full h-[44px] px-3" style={{fontSize: '16px'}} />
```

### Icon Size (Grows with screen)
```jsx
<Icon size={20} className="sm:w-6" />
```

---

## 📐 Spacing Scale

```
p-3   = 12px    (mobile padding)
p-4   = 16px    (mobile base)
p-5   = 20px    (tablet)
p-6   = 24px    (desktop)
p-8   = 32px    (large desktop)

Gap scale: gap-3, gap-4, gap-5, gap-6, gap-8
```

---

## 📏 Typography Scale

| Size | Text | Mobile | Tablet | Desktop |
|------|------|--------|--------|---------|
| H1 | Heading 1 | 1.5rem | 2rem | 2.5rem |
| H2 | Heading 2 | 1.25rem | 1.75rem | 2rem |
| H3 | Heading 3 | 1.125rem | 1.25rem | 1.5rem |
| Body | Paragraph | 0.875rem | 1rem | 1rem |
| Small | Label | 0.75rem | 0.875rem | 0.875rem |

**Apply with:**
```jsx
<h1 className="text-xl sm:text-2xl lg:text-3xl">
<p className="text-xs sm:text-sm md:text-base">
```

---

## 🎯 Grid Patterns

### 1-column (Mobile)
```jsx
className="grid grid-cols-1"
```

### 2-column (Mobile/Tablet)
```jsx
className="grid grid-cols-2 md:grid-cols-2"
```

### 3-column (Tablet/Desktop)
```jsx
className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3"
```

### 2→3→6 (Feature Cards) ⭐
```jsx
className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
```

### 1→2→3 (Content)
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Responsive Gap
```jsx
className="grid gap-3 sm:gap-4 md:gap-6"
```

---

## 🔧 Common Responsive Patterns

### Sidebar Layout (Stack mobile, side-by-side desktop)
```jsx
<div className="md:flex gap-6">
  <aside className="w-full md:w-64">Sidebar</aside>
  <main className="flex-1">Content</main>
</div>
```

### Horizontal Scroll (Mobile-friendly list)
```jsx
<div className="overflow-x-auto md:overflow-x-visible">
  <div className="flex gap-3 md:grid md:grid-cols-3">
    {/* Items scroll on mobile, grid on desktop */}
  </div>
</div>
```

### Centered Content with Max Width
```jsx
<div className="max-w-6xl mx-auto p-4 sm:p-6">
  {/* Centered, with responsive padding */}
</div>
```

### Collapse on Mobile
```jsx
<section className="hidden md:block">
  {/* Only shows on desktop */}
</section>
```

### Text Clipping (Prevent overflow)
```jsx
<h3 className="line-clamp-2 sm:line-clamp-1">
  {/* 2 lines on mobile, 1 on desktop */}
</h3>
```

---

## 👆 Touch & Interaction

### Touch-friendly Padding
```jsx
<button className="p-3 md:p-4">  {/* 44px×44px minimum */}
```

### Safe Area (Notched devices)
```jsx
<nav className="pt-4 sm:pt-6 md:pt-8">
  {/* Padding increases away from notch */}
</nav>
```

### Mobile Menu
```jsx
<nav className="block md:hidden">  {/* Hidden on desktop */}
<nav className="hidden md:block">  {/* Hidden on mobile */}
```

### Touch State (Press feedback)
```jsx
<button className="active:scale-95 md:hover:scale-105" />
{/* Mobile: Press effect | Desktop: Hover effect */}
```

---

## 🖼️ Image Responsive

### Responsive Image
```jsx
<img 
  src="image.png" 
  alt="Description"
  className="w-full h-auto md:w-1/2"
  loading="lazy"
/>
```

### Picture Element (Different images)
```jsx
<picture>
  <source media="(max-width: 640px)" srcSet="mobile.jpg" />
  <source media="(min-width: 641px)" srcSet="desktop.jpg" />
  <img src="fallback.jpg" alt="Description" />
</picture>
```

---

## 📋 Mobile-First Development Checklist

Before marking a feature complete:

- [ ] **Mobile (320px)** - All content readable, no overflow
- [ ] **Tablet (768px)** - Better use of space, columns increase
- [ ] **Desktop (1024px)** - Optimal layout, all features visible
- [ ] **Touch targets** - All interactive elements ≥44px
- [ ] **Text readable** - Minimum 14px on mobile, 16px for inputs
- [ ] **No horizontal scroll** - Unless intentional (carousels)
- [ ] **Images scale** - Use `w-full h-auto` pattern
- [ ] **Forms work** - 16px font, proper spacing
- [ ] **Landscape mode** - Check layout in landscape
- [ ] **Tested in DevTools** - At least 3 breakpoints

---

## 🚨 Common Mistakes to Avoid

| ❌ Avoid | ✅ Use Instead |
|----------|---|
| `grid grid-cols-6` on all screens | `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6` |
| Fixed widths `w-96` | Responsive `w-full md:w-96` |
| Small fonts everywhere `text-xs` | Scale fonts `text-xs sm:text-sm` |
| No padding on mobile | Use `p-4 sm:p-6` pattern |
| Touch targets < 44px | Ensure `min-h-[44px]` on buttons |
| Input font < 16px | Always use `font-size: 16px` on inputs |
| Design desktop-first | Start mobile (`sm:`, `md:` prefixes) |
| Big gaps on mobile | Use `gap-3` mobile → `gap-6` desktop |
| Hide content on mobile with `hidden` | Use `hidden md:block` to show on desktop |
| Hardcoded colors | Use CSS variables from theme |

---

## 🧪 Quick Testing (2 minutes)

```
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test widths: 320px, 768px, 1024px
4. Verify grids change columns
5. Check text is readable
6. Ensure buttons are 44px+
7. No horizontal scrolling
PASS ✓
```

---

## 📁 File Reference

| File | Contains | When to Edit |
|------|----------|---|
| `index.css` | All media queries, typography scale | Add new responsive rules |
| `tailwind.config.js` | Breakpoints, color theme, utilities | Change breakpoints or theme |
| `index.html` | Meta tags, viewport setup | Mobile meta tag changes |
| `*.jsx` | Component classes | Add `sm:`, `md:`, `lg:` prefixes |

---

## 🔗 Key Files

- 📖 **RESPONSIVE_DESIGN_ARCHITECTURE.md** - Complete system documentation
- 📱 **MOBILE_OPTIMIZATION_GUIDE.md** - Testing methodology
- 🧪 **RESPONSIVE_TESTING_GUIDE.md** - Step-by-step testing instructions
- 📐 **CSS_RESPONSIVE_FIXES.md** - CSS improvements reference

---

## 💡 Pro Tips

1. **Use `w-full` by default** - Makes responsive easier later
2. **Always add `h-auto` to images** - Prevents aspect ratio issues
3. **Test on real device** - DevTools ≠ real behavior
4. **Mobile first, then enhance** - `sm:`, `md:`, `lg:` prefixes
5. **44px rule** - All buttons/links must be tappable
6. **16px for inputs** - Prevents iOS auto-zoom
7. **Throttle network** - Test on "Slow 4G" in DevTools
8. **Check landscape** - Rotate device icon in DevTools

---

## 🎓 30-Second Rules

1. **Base classes = mobile** - `grid grid-cols-2`
2. **Prefixes = larger screens** - `sm:grid-cols-3 lg:grid-cols-6`
3. **Touch targets** - 44px × 44px minimum
4. **Safe areas** - Padding from notches on iPhone
5. **Text readable** - 14px+ base, 16px+ for inputs

---

## 🆘 Stuck?

**Grid showing wrong columns?**  
Check: `grid grid-cols-X` (mobile) → `sm:grid-cols-Y` (tablet) → `lg:grid-cols-Z` (desktop)

**Text too small?**  
Check: `text-xs md:text-sm lg:text-base` chain

**Overflow happening?**  
Check: Add `w-full` and `overflow-hidden` with `line-clamp-*`

**Button can't tap?**  
Check: `min-h-[44px]` and `p-3` for padding

**Safe area showing gap?**  
Check: `pt-safe` or `env(safe-area-inset-top)` applied

---

**Last Updated:** 2024  
**Version:** 1.0

*Keep this card open while developing for quick reference!*
