# Styling Guide

## Overview

The Pour-Over Recipe Finder uses a coffee-themed design system with warm, earthy tones inspired by specialty coffee culture.

## Color Palette

### Light Mode
- **Cream** (`#f5f0e8`) - Main background
- **Parchment** (`#ede4d0`) - Secondary background
- **Espresso** (`#1a0f07`) - Primary text
- **Roast** (`#3d1f0a`) - Secondary text
- **Caramel** (`#b87333`) - Accent color
- **Honey** (`#d4882b`) - Secondary accent
- **Subtle** (`#8a7060`) - Muted text
- **Card** (`#faf7f2`) - Card background
- **Border** (`#d6c9b0`) - Border color

### Dark Mode
The palette automatically inverts for dark mode preference.

## Typography

### Fonts
- **Headings**: Playfair Display (serif)
- **Body**: DM Sans (sans-serif)
- **Monospace**: DM Mono (labels, time, code)

Fonts are loaded from Google Fonts in `app/globals.css`.

### Usage
```tsx
// Headings use Playfair Display automatically
<h1>Recipe Finder</h1>

// Labels use DM Mono
<div className="section-label">Equipment</div>

// Body text uses DM Sans by default
<p>Description text</p>
```

## Components

### Form Sections
Three visually distinct sections with unified card styling:

```tsx
<div className="form-section">
  <h2 className="section-label">⚙️ Equipment</h2>
  <p className="section-description">Select your equipment</p>
  {/* fields */}
</div>
```

### Form Fields
```tsx
<div className="form-field">
  <label className="form-label">Field Name</label>
  <select className="form-select">
    <option>Option</option>
  </select>
</div>
```

### Buttons
```tsx
<button className="submit-button">
  Generate Recipe
</button>
```

### Recipe Cards
```tsx
<div className="recipe-card">
  {/* content */}
</div>
```

### Grind Zone Badges
```tsx
<span className="zone-badge zone-fine">Fine</span>
<span className="zone-badge zone-medium">Medium</span>
<span className="zone-badge zone-coarse">Coarse</span>
```

### Pour Steps
```tsx
<div className="pour-step">
  <div className="step-time">0:00-0:45</div>
  <div>
    <div className="step-label">Bloom</div>
    <div className="step-note">Gentle pour</div>
  </div>
  <div className="step-weight">45g</div>
</div>
```

## CSS Architecture

### Files
- `app/globals.css` - Global styles, fonts, CSS variables
- `app/styles.css` - Component styles with Tailwind @apply

### CSS Variables
All colors use CSS variables for easy theming:

```css
background: var(--card);
color: var(--espresso);
border-color: var(--border);
```

### Tailwind Integration
Uses Tailwind's `@apply` directive for component styles:

```css
.form-field {
  @apply mb-4 last:mb-0;
}
```

## Design Principles

1. **Warmth**: Coffee-inspired earthy tones
2. **Clarity**: Clear hierarchy with proper spacing
3. **Typography**: Serif headings, sans-serif body
4. **Subtle Shadows**: Soft depth without heaviness
5. **Monospace for Data**: Time, measurements, codes
6. **Consistent Rounding**: 12-16px border radius
7. **Visual Sections**: Distinct cards for each category

## Responsive Design

- Mobile-first approach
- Fluid typography with `clamp()`
- Grid layouts adapt to screen size
- Touch-friendly form controls (min 44px)

## Accessibility

- Focus states with visible ring
- Color contrast meets WCAG AA
- Semantic HTML structure
- Label associations
- Keyboard navigation support

## Adding Custom Styles

### For New Components
Add to `app/styles.css`:

```css
.my-component {
  @apply p-4 rounded-lg;
  background: var(--card);
  border: 1px solid var(--border);
}
```

### For One-Off Styles
Use inline styles with CSS variables:

```tsx
<div style={{ color: "var(--caramel)" }}>
  Accent text
</div>
```

## Examples

### Form Section
```tsx
<div className="form-section">
  <h2 className="section-label">Section Title</h2>
  <p className="section-description">Description text</p>

  <div className="form-field">
    <label className="form-label">Label</label>
    <select className="form-select">
      <option>Option 1</option>
    </select>
  </div>
</div>
```

### Recipe Overview
```tsx
<div className="recipe-overview-grid">
  <div className="recipe-overview-item">
    <div className="recipe-overview-item-label">Dose</div>
    <div className="recipe-overview-item-value">15g</div>
  </div>
</div>
```

### Reason Card
```tsx
<div className="reasons-card">
  <div className="reasons-list">
    <div className="reason">
      <span className="reason-emoji">☕</span>
      <div className="reason-text">
        <strong>Factor:</strong> Explanation
      </div>
    </div>
  </div>
</div>
```

## Browser Support

- Modern browsers (last 2 versions)
- CSS Grid and Flexbox required
- CSS custom properties required
- No IE11 support

## Performance

- Minimal CSS bundle size
- Google Fonts loaded efficiently
- No runtime CSS-in-JS overhead
- Static CSS with Tailwind purging
