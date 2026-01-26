# Modern UI Design System Guide

This guide provides comprehensive documentation for using the modern UI components and utilities in your application.

## Table of Contents
- [Responsive Design](#responsive-design)
- [Layout System](#layout-system)
- [Components](#components)
- [Utilities](#utilities)
- [Accessibility](#accessibility)

---

## Responsive Design

### Breakpoints
The design system uses the following breakpoints:

- **Desktop**: > 992px
- **Tablet**: 768px - 991px
- **Mobile**: 576px - 767px
- **Small Mobile**: < 576px

### Responsive Utilities

```html
<!-- Hide on mobile devices -->
<div class="hide-mobile">Desktop only content</div>

<!-- Hide on desktop devices -->
<div class="hide-desktop">Mobile only content</div>
```

---

## Layout System

### Modern Grid System

Use the modern grid system for responsive layouts:

```html
<!-- Auto-responsive grid (280px minimum column width) -->
<div class="modern-grid">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>

<!-- 2-column grid -->
<div class="modern-grid grid-2">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
</div>

<!-- 3-column grid -->
<div class="modern-grid grid-3">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>

<!-- 4-column grid -->
<div class="modern-grid grid-4">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
</div>
```

**Note**: Grid automatically adjusts to:
- 2 columns on tablet
- 1 column on mobile

### Flexbox Utilities

```html
<!-- Basic flex container -->
<div class="modern-flex">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Flex with wrapping -->
<div class="modern-flex flex-wrap">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Center aligned flex -->
<div class="modern-flex flex-center">
  <div>Centered content</div>
</div>

<!-- Space between items -->
<div class="modern-flex flex-between">
  <div>Left</div>
  <div>Right</div>
</div>

<!-- Column direction -->
<div class="modern-flex flex-column">
  <div>Top</div>
  <div>Bottom</div>
</div>
```

---

## Components

### Statistics Cards

Beautiful gradient cards for displaying statistics:

```html
<!-- Primary stat card -->
<div class="stat-card">
  <div class="stat-value">1,234</div>
  <div class="stat-label">Total Users</div>
</div>

<!-- Success variant -->
<div class="stat-card stat-success">
  <div class="stat-value">98%</div>
  <div class="stat-label">Success Rate</div>
</div>

<!-- Warning variant -->
<div class="stat-card stat-warning">
  <div class="stat-value">23</div>
  <div class="stat-label">Pending Tasks</div>
</div>

<!-- Error variant -->
<div class="stat-card stat-error">
  <div class="stat-value">5</div>
  <div class="stat-label">Failed Jobs</div>
</div>

<!-- Info variant -->
<div class="stat-card stat-info">
  <div class="stat-value">456</div>
  <div class="stat-label">Active Sessions</div>
</div>
```

### Loading States (Skeleton Screens)

Show loading states while content is being fetched:

```html
<!-- Text skeleton -->
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-text" style="width: 80%;"></div>

<!-- Title skeleton -->
<div class="skeleton skeleton-title"></div>

<!-- Avatar skeleton -->
<div class="skeleton skeleton-avatar"></div>

<!-- Custom skeleton -->
<div class="skeleton" style="width: 100%; height: 200px;"></div>
```

### Progress Bars

Modern animated progress bars:

```html
<!-- Default progress bar -->
<div class="modern-progress">
  <div class="progress-bar" style="width: 75%"></div>
</div>

<!-- Success progress bar -->
<div class="modern-progress progress-success">
  <div class="progress-bar" style="width: 90%"></div>
</div>

<!-- Warning progress bar -->
<div class="modern-progress progress-warning">
  <div class="progress-bar" style="width: 60%"></div>
</div>

<!-- Error progress bar -->
<div class="modern-progress progress-error">
  <div class="progress-bar" style="width: 30%"></div>
</div>
```

### Modern Switches/Toggles

```html
<label class="modern-switch">
  <input type="checkbox" />
  <span class="switch-slider"></span>
</label>
```

### Chips/Tags

```html
<!-- Default chip -->
<span class="modern-chip">Default Tag</span>

<!-- Primary chip -->
<span class="modern-chip chip-primary">Primary Tag</span>

<!-- Success chip -->
<span class="modern-chip chip-success">Success Tag</span>

<!-- Warning chip -->
<span class="modern-chip chip-warning">Warning Tag</span>

<!-- Error chip -->
<span class="modern-chip chip-error">Error Tag</span>

<!-- Chip with remove button -->
<span class="modern-chip">
  Tag Name
  <span class="chip-remove">×</span>
</span>
```

### Empty States

Display when there's no data:

```html
<div class="empty-state">
  <div class="empty-icon">
    <i class="bi bi-inbox" style="font-size: 80px;"></i>
  </div>
  <div class="empty-title">No items found</div>
  <div class="empty-description">
    You don't have any items yet. Create your first item to get started.
  </div>
  <button class="btn btn-primary">Create New Item</button>
</div>
```

### Tooltips

Add tooltips to any element:

```html
<button class="btn btn-primary" data-tooltip="Click to save">
  Save
</button>

<span data-tooltip="This is a helpful tooltip">
  Hover over me
</span>
```

---

## Utilities

### Animations

```html
<!-- Fade in animation -->
<div class="fade-in">
  Content fades in
</div>

<!-- Slide in animation -->
<div class="slide-in">
  Content slides in from left
</div>
```

### Cards

All cards are automatically modernized with hover effects:

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
  </div>
  <div class="card-body">
    Card content goes here
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

### Buttons

Modern button styles are automatically applied:

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-light">Light</button>
```

**On mobile**: Button groups automatically stack vertically for better usability.

### Forms

Modern form controls with validation:

```html
<div class="mb-4">
  <label class="form-label">Email Address</label>
  <input type="email" class="form-control" placeholder="Enter email">
</div>

<div class="mb-4">
  <label class="form-label">Country</label>
  <select class="form-select">
    <option>Select country</option>
    <option>United States</option>
    <option>United Kingdom</option>
  </select>
</div>
```

**Note**: Forms automatically prevent iOS zoom (16px font size on mobile).

### Tables

Responsive tables with horizontal scroll on mobile:

```html
<div class="table-responsive">
  <table class="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John Doe</td>
        <td>john@example.com</td>
        <td><span class="badge bg-success">Active</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

### Alerts

```html
<div class="alert alert-primary">Primary alert</div>
<div class="alert alert-success">Success alert</div>
<div class="alert alert-warning">Warning alert</div>
<div class="alert alert-danger">Danger alert</div>
<div class="alert alert-info">Info alert</div>
```

### Badges

```html
<span class="badge bg-primary">Primary</span>
<span class="badge bg-success">Success</span>
<span class="badge bg-warning">Warning</span>
<span class="badge bg-danger">Danger</span>
```

### Modals

Modals are automatically responsive:

```html
<div class="modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal Title</h5>
        <button type="button" class="btn-close"></button>
      </div>
      <div class="modal-body">
        Modal content
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary">Close</button>
        <button class="btn btn-primary">Save</button>
      </div>
    </div>
  </div>
</div>
```

### Dropdowns

```html
<div class="dropdown">
  <button class="btn btn-primary dropdown-toggle">
    Dropdown
  </button>
  <div class="dropdown-menu">
    <a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item" href="#">Separated link</a>
  </div>
</div>
```

---

## Accessibility

### Focus Visible

All interactive elements have clear focus indicators for keyboard navigation.

### Touch Targets

On touch devices, all interactive elements have minimum 44px touch targets (iOS guideline).

### Skip to Main Content

Add this link at the start of your page for keyboard users:

```html
<a href="#main-content" class="skip-to-main">
  Skip to main content
</a>

<main id="main-content">
  <!-- Your content -->
</main>
```

### High Contrast Mode

The design system automatically adjusts for users who prefer high contrast:
- Borders become thicker
- Colors adjust for better visibility

### Reduced Motion

Users who prefer reduced motion will see:
- Minimal animations
- Instant transitions
- No auto-playing animations

---

## Responsive Behavior

### Sidebar

- **Desktop (>991px)**: Fixed sidebar, 280px width, collapses to 80px
- **Tablet (768-991px)**: Slide-out drawer, hidden by default
- **Mobile (<768px)**: Slide-out drawer, hidden by default

### Header

- **Desktop**: Fixed height (70px)
- **Tablet**: Adjusts for smaller screens
- **Mobile**: Stacks elements, minimum 60px height

### Content Padding

- **Desktop**: 24px (modern-spacing-6)
- **Tablet**: 16px (modern-spacing-4)
- **Mobile**: 12px (modern-spacing-3)
- **Small Mobile**: 8px (modern-spacing-2)

---

## Color Scheme

### Primary Colors
- **Primary**: #0066FF (Modern blue)
- **Primary Dark**: #0052CC
- **Primary Lighter**: #E6F0FF

### Status Colors
- **Success**: #00C853 / Dark: #00A047
- **Warning**: #FF9800 / Dark: #F57C00
- **Error**: #F44336 / Dark: #D32F2F
- **Info**: #2196F3 / Dark: #1976D2

### Neutral Colors
- **Gray 50**: #F9FAFB (Background)
- **Gray 100**: #F3F4F6
- **Gray 200**: #E5E7EB (Borders)
- **Gray 300**: #D1D5DB
- **Gray 400**: #9CA3AF
- **Gray 500**: #6B7280
- **Gray 600**: #4B5563
- **Gray 700**: #374151 (Text)
- **Gray 800**: #1F2937
- **Gray 900**: #111827 (Headings)

---

## Best Practices

### 1. Use Semantic HTML
Always use proper HTML5 semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, etc.)

### 2. Mobile-First Approach
Design for mobile first, then enhance for larger screens.

### 3. Consistent Spacing
Use the spacing variables:
- `$modern-spacing-1`: 4px
- `$modern-spacing-2`: 8px
- `$modern-spacing-3`: 12px
- `$modern-spacing-4`: 16px
- `$modern-spacing-6`: 24px
- `$modern-spacing-8`: 32px

### 4. Accessible Color Contrast
Ensure text has at least 4.5:1 contrast ratio (WCAG AA standard).

### 5. Touch-Friendly
Make all interactive elements at least 44x44px on mobile.

### 6. Loading States
Always show skeleton loaders while content is loading.

### 7. Empty States
Provide helpful empty states when there's no content.

### 8. Error Handling
Show clear, actionable error messages.

---

## Examples

### Dashboard Layout

```html
<div class="content">
  <div class="modern-grid grid-4">
    <div class="stat-card">
      <div class="stat-value">1,234</div>
      <div class="stat-label">Total Users</div>
    </div>
    <div class="stat-card stat-success">
      <div class="stat-value">$45.2K</div>
      <div class="stat-label">Revenue</div>
    </div>
    <div class="stat-card stat-warning">
      <div class="stat-value">23</div>
      <div class="stat-label">Pending</div>
    </div>
    <div class="stat-card stat-info">
      <div class="stat-value">456</div>
      <div class="stat-label">Active</div>
    </div>
  </div>

  <div class="card mt-6">
    <div class="card-header">
      <h3 class="card-title">Recent Activity</h3>
    </div>
    <div class="card-body">
      <!-- Content here -->
    </div>
  </div>
</div>
```

### List Page

```html
<div class="content">
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Projects</h3>
      <button class="btn btn-primary">New Project</button>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Project Alpha</td>
              <td><span class="modern-chip chip-success">Active</span></td>
              <td>Jan 15, 2024</td>
              <td>
                <button class="btn btn-sm btn-light">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
```

---

## Support

For questions or issues, please refer to the project documentation or contact the development team.
