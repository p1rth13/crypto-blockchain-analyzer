# CryptoAnalyzer Design System

## Overview
A professional, data-focused design system for cryptocurrency analysis platforms. Emphasizes clarity, trust, and usability for professional users.

## Design Principles
- **Clear & Calm**: Minimal visual noise, high readability
- **Trustworthy**: Consistent patterns, predictable interactions
- **Data-Focused**: Metrics prominence, efficient scanning
- **Professional**: Modern aesthetics, accessible design

---

## Color Palette

### Primary Colors
```css
--color-neutral-900: #0a0a0a    /* Background */
--color-neutral-800: #1a1a1a    /* Surface */
--color-primary-500: #0ea5e9    /* Primary accent */
--color-success-500: #10b981    /* Success */
--color-warning-500: #f59e0b    /* Warning */
--color-error-500: #ef4444     /* Error */
```

### Text Colors
```css
--text-primary: #ffffff         /* Primary text */
--text-secondary: #d4d4d8      /* Secondary text */
--text-tertiary: #a3a3a3       /* Tertiary text */
--text-disabled: #e5e7eb       /* Disabled text */
```

### Semantic Colors
```css
--bg-primary: var(--color-neutral-900)
--bg-secondary: var(--color-neutral-800)
--surface-primary: var(--color-neutral-800)
--surface-secondary: var(--color-neutral-700)
--border-subtle: var(--color-neutral-500)
--border-default: var(--color-neutral-400)
```

---

## Typography

### Font Family
- **Primary**: Inter (highly legible, modern)
- **Monospace**: JetBrains Mono (code, hashes, addresses)

### Type Scale (8px baseline)
```css
--text-xs: 0.75rem     /* 12px - Microcopy */
--text-sm: 0.875rem    /* 14px - Small text */
--text-base: 1rem      /* 16px - Body text */
--text-lg: 1.125rem    /* 18px - Large text */
--text-xl: 1.25rem     /* 20px - H3 */
--text-2xl: 1.5rem     /* 24px - H2 */
--text-3xl: 1.875rem   /* 30px - H1 */
--text-4xl: 2.25rem    /* 36px - Title */
--text-5xl: 3rem       /* 48px - Display */
```

### Usage Examples
```html
<h1 class="text-title">Page Title</h1>
<h2 class="text-h1">Section Heading</h2>
<h3 class="text-h2">Subsection</h3>
<p class="text-body">Body text</p>
<small class="text-small">Secondary info</small>
<span class="text-micro">Timestamps, labels</span>
```

---

## Spacing System (8px baseline)

```css
--space-1: 0.25rem    /* 4px */
--space-2: 0.5rem     /* 8px */
--space-3: 0.75rem    /* 12px */
--space-4: 1rem       /* 16px */
--space-5: 1.25rem    /* 20px */
--space-6: 1.5rem     /* 24px */
--space-8: 2rem       /* 32px */
--space-10: 2.5rem    /* 40px */
--space-12: 3rem      /* 48px */
--space-16: 4rem      /* 64px */
--space-20: 5rem      /* 80px */
--space-24: 6rem      /* 96px */
```

---

## Component Library

### Buttons

#### Primary Button
```html
<button class="btn btn-primary">
  Primary Action
</button>
```

#### Secondary Button
```html
<button class="btn btn-secondary">
  Secondary Action
</button>
```

#### Tertiary Button
```html
<button class="btn btn-tertiary">
  Tertiary Action
</button>
```

#### Icon Button
```html
<button class="btn btn-icon btn-tertiary">
  <Icon class="w-4 h-4" />
</button>
```

### Cards

#### Basic Card
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
    <p class="card-description">Card description</p>
  </div>
  <div class="card-content">
    <!-- Content -->
  </div>
  <div class="card-actions">
    <button class="btn btn-tertiary">Cancel</button>
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

#### Metric Card
```html
<div class="metric-card">
  <div class="metric-header">
    <h3 class="metric-title">Total Volume</h3>
    <Icon class="metric-icon" />
  </div>
  <div class="metric-value">$2.4B</div>
  <div class="metric-change positive">
    <TrendingUp class="w-4 h-4" />
    <span>+12.5%</span>
  </div>
</div>
```

### Navigation

#### Tab Navigation
```html
<div class="nav-tabs">
  <a href="#" class="nav-tab active">
    <Icon class="w-4 h-4" />
    <span>Overview</span>
  </a>
  <a href="#" class="nav-tab">
    <Icon class="w-4 h-4" />
    <span>Transactions</span>
  </a>
</div>
```

### Forms

#### Input Field
```html
<div class="form-group">
  <label class="form-label">Label</label>
  <input type="text" class="form-input" placeholder="Placeholder">
  <div class="form-help">Helper text</div>
</div>
```

### Tables

#### Data Table
```html
<div class="table-container">
  <table class="table">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data 1</td>
        <td>Data 2</td>
        <td>
          <button class="btn btn-sm btn-tertiary">Edit</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Badges

```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-error">Error</span>
```

---

## Layout System

### Responsive Grid (12-column)

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>
```

### Container
```html
<div class="container">
  <!-- Max-width container with responsive padding -->
</div>
```

---

## Accessibility

### Color Contrast
- **Body text**: WCAG AA compliant (4.5:1 minimum)
- **Important numbers**: WCAG AAA compliant (7:1 minimum)

### Interactive Elements
- **Minimum touch target**: 44px × 44px
- **Focus indicators**: 2px solid primary color
- **Keyboard navigation**: Full support

### Screen Readers
- **Semantic HTML**: Proper heading hierarchy
- **ARIA labels**: For complex interactions
- **Screen reader text**: `.sr-only` class for context

---

## Micro-interactions

### Transitions
```css
--transition-fast: 150ms ease-out
--transition-base: 200ms ease-out
--transition-slow: 300ms ease-out
```

### States
- **Hover**: Subtle color/elevation changes
- **Focus**: Visible focus rings
- **Active**: Pressed state feedback
- **Loading**: Spinner or skeleton states

---

## Breakpoints

```css
--breakpoint-sm: 640px    /* Mobile landscape */
--breakpoint-md: 768px    /* Tablet */
--breakpoint-lg: 1024px   /* Desktop */
--breakpoint-xl: 1280px   /* Large desktop */
--breakpoint-2xl: 1536px  /* XL desktop */
```

---

## Usage Guidelines

### Do's
✅ Use consistent spacing from the 8px baseline grid
✅ Maintain color contrast ratios
✅ Follow the component patterns
✅ Use semantic HTML elements
✅ Provide keyboard navigation
✅ Include focus states for all interactive elements

### Don'ts
❌ Mix different design patterns
❌ Use colors outside the defined palette
❌ Create custom spacing values
❌ Ignore accessibility requirements
❌ Add unnecessary visual decoration
❌ Mix multiple typefaces
