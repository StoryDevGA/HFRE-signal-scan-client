# FRONT-END-STYLE-GUIDE.md - HFRE Signal Scan (Free Taster)

## 1. Purpose

Document the front-end style system and component usage based on the VMF v1 client component library. This guide focuses only on the components needed for the HFRE Signal Scan public form and admin dashboard.

## 2. Source of Truth

Component implementations and CSS come from `C:\Users\garya\OneDrive\Documents\StoryLineOS\VMF-v-1-client\src`.

Core style files to mirror:
- `src/styles/variables.css` (design tokens)
- `src/styles/themes.css` (semantic theme mapping)
- `src/styles/brands/index.css` (brand theme registry)
- `src/styles/responsive.css` (layout and typography utilities)
- `src/styles/reset.css` (baseline normalization)
- `src/styles/index.css` (global entrypoint and base rules)

Import order must match `src/styles/index.css`:
1) `reset.css`
2) `variables.css`
3) `themes.css`
4) `brands/index.css`
5) `responsive.css`
6) global base rules (`body`, `code`, `.sr-only`)

## 3. Design Tokens

All UI styling should use CSS variables from the VMF design tokens.

### 3.1 Spacing
- Base scale: 8px
- Use `--spacing-2xs` through `--spacing-3xl` for padding, gaps, margins.

### 3.2 Typography
- Font families: `--font-primary` and `--font-sans`
- Font sizes: `--font-size-xs` through `--font-size-3xl`
- Line heights: `--line-height-tight`, `--line-height-normal`, `--line-height-relaxed`

### 3.3 Fonts
Default font stack comes from `variables.css`:
- Primary/sans: `Arial, Helvetica, sans-serif`
- Mono: `'Courier New', Courier, monospace`

No external font assets are required for the base HFRE UI. If a branded font is introduced later, update `--font-primary` and `--font-sans` only.

### 3.4 Colors (Semantic)
Use semantic variables rather than raw palette values:
- Backgrounds: `--color-background`, `--color-background-secondary`, `--color-background-tertiary`
- Surfaces: `--color-surface`, `--color-surface-elevated`
- Text: `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`
- Borders: `--color-border`, `--color-border-hover`, `--color-border-focus`
- Actions: `--color-action-primary`, `--color-action-primary-hover`, `--color-action-primary-active`

### 3.5 Borders and Shadows
- Border radius tokens: `--border-radius-sm` to `--border-radius-xl`
- Shadows: `--shadow-sm` to `--shadow-xl`

### 3.6 Motion and Animations
Use transition tokens from `variables.css`:
- `--transition-fast`, `--transition-base`, `--transition-slow`

Motion used by required components:
- `Button` loading spinner (`btn-spin`) and hover/active transitions.
- `Input` and `Textarea` floating label transitions.
- `Dialog` scale-in and backdrop fade-in.
- `Toaster` slide-in animation.
- `Spinner` rotation.
- `Table` skeleton loading animation.
- `Status` optional pulse animation.

Accessibility:
- Honor `prefers-reduced-motion` via `styles/reset.css` (animations and transitions are reduced or removed).

## 4. Theme and Brand System

### 4.1 Default + Dark Theme
- Default theme uses `:root` in `themes.css`.
- Dark theme is enabled with `data-theme="dark"` on `html` or `body`.
- Auto-dark activates if no `data-theme` is set and user prefers dark mode.

### 4.2 Brand Themes (Data Attribute)
Set `data-theme` to one of the following for brand palettes:
- `brand-corporate` (blue)
- `brand-vibrant` (coral)
- `brand-emerald` (green)
- `brand-royal` (purple)
- `brand-warm` (amber)

These override `--color-primary-*` and action/border focus colors.

## 5. Layout and Responsiveness

### 4.1 Container
Use `.container` for page-level horizontal layout. It sets max-widths at 640/768/1024/1280/1536.

### 4.2 Grid and Flex Utilities
- `.grid` + responsive column helpers (`.grid-sm-2`, `.grid-md-3`, etc.)
- `.flex`, `.flex-col`, `.flex-wrap`, `.flex-md-row`

### 4.3 Responsive Typography
Use responsive helpers for headings and body copy:
- `.text-responsive-xl`, `.text-responsive-lg`, `.text-responsive-md`, `.text-responsive-base`
- `.text-fluid-xl`, `.text-fluid-lg`, `.text-fluid-md`, `.text-fluid-base`

## 6. Components (Full VMF Catalog)

### 6.1 Button
Source: `src/components/Button`

Variants:
- `primary`, `secondary`, `outline`, `ghost`, `danger`

Sizes:
- `sm`, `md`, `lg`

Key props:
- `loading` (shows spinner and disables click)
- `disabled`
- `fullWidth`
- `doubleOutline` (emphasis)
- `square` (no border radius)
- `iconOnly`, `leftIcon`, `rightIcon`

Use cases:
- Submit, login, delete, pagination, table row actions.

### 6.2 Input
Source: `src/components/Input`

Features:
- Floating label
- Error and helper text
- Optional left/right icons

Key props:
- `label`, `placeholder`, `error`, `helperText`, `required`
- `size`, `variant`, `fullWidth`

Use cases:
- Public form fields, admin login, search inputs.

### 6.3 Textarea
Source: `src/components/Textarea`

Features:
- Floating label
- Error and helper text
- Resize control

Key props:
- `rows`, `resize`, `error`, `helperText`, `required`
- `variant` (`default`, `outlined`, `filled`), `size`, `fullWidth`

Use cases:
- Optional freeform notes or admin prompt editing.

### 6.4 Select
Source: `src/components/Select`

Key props:
- `options` (array of `{ value, label }`)
- `placeholder`, `error`, `helperText`, `size`

Use cases:
- Admin filters (status, date range, sort options).

### 6.5 Tickbox
Source: `src/components/Tickbox`

Key props:
- `checked`, `indeterminate`, `onChange`

Use cases:
- Table row selection, consent toggles.

### 6.6 Radio
Source: `src/components/Radio`

Key props:
- `name`, `value`, `checked`, `onChange`

Use cases:
- Small choice sets (optional).

### 6.7 Spinner
Source: `src/components/Spinner`

Key props:
- `type` (`pinwheel` or `circle`)
- `size` (`sm`, `md`, `lg`)
- `color` (for `circle` type)

Use cases:
- Blocking or inline loading indicators.

### 6.8 Toaster
Source: `src/components/Toaster`

Usage pattern:
- Wrap app with `<ToasterProvider>`
- Use `useToaster()` to trigger notifications

Variants:
- `info`, `success`, `warning`, `error`

Use cases:
- Form submit success/failure, admin actions, background updates.

### 6.9 Dialog
Source: `src/components/Dialog`

Features:
- Uses native `<dialog>` element
- Backdrop/escape handling
- Includes Header/Body/Footer subcomponents

Key props:
- `open`, `onClose`, `size`, `variant`
- `closeOnBackdropClick`, `closeOnEscape`, `showCloseButton`

Use cases:
- Confirmation modals for deletions.

### 6.10 Status
Source: `src/components/Status`

Variants:
- `success`, `warning`, `error`, `info`, `neutral`

Key props:
- `pulse`, `showIcon`

Use cases:
- Submission status badges (pending/complete/failed).

### 6.11 Table
Source: `src/components/Table`

Capabilities:
- Props-based API with `columns` + `data`
- JSX-based API (compound components)
- Sorting, selection, row actions
- Loading and empty states

Use cases:
- Admin submissions list, analytics tables.

### 6.12 Card
Source: `src/components/Card`

Variants:
- `default`, `outlined`, `elevated`, `filled`

Key props:
- `hoverable`, `clickable`, `rounded`

Use cases:
- Summary panels, report sections, admin overview blocks.

### 6.13 Fieldset
Source: `src/components/Fieldset`

Use cases:
- Grouping form sections with legend and consistent spacing.

### 6.14 Link
Source: `src/components/Link`

Use cases:
- In-app navigation and inline links with consistent hover/focus styling.

### 6.15 Tooltip
Source: `src/components/Tooltip`

Use cases:
- Contextual help on form fields, admin table actions, and labels.

### 6.16 Accordion
Source: `src/components/Accordion`

Use cases:
- FAQ-style content or collapsible admin panels.

### 6.17 TabView
Source: `src/components/TabView`

Use cases:
- Organizing admin views or report sections without route changes.

### 6.18 Stepper
Source: `src/components/Stepper`

Use cases:
- Multi-step flows if the public form becomes multi-page.

### 6.19 HorizontalScroll
Source: `src/components/HorizontalScroll`

Use cases:
- Horizontal card rails for reports or analytics summaries.

### 6.20 Header and Footer
Source: `src/components/Header`, `src/components/Footer`

Use cases:
- Consistent top-level layout and footer treatment across public and admin pages.

### 6.21 Navigation
Source: `src/components/Navigation`

Use cases:
- Primary navigation menus (admin sidebar or top nav).

### 6.22 Logo
Source: `src/components/Logo`

Use cases:
- Brand lockup in header/login screens (assets required later).

### 6.23 VMFNavbar
Source: `src/components/VMFNavbar`

Use cases:
- Full featured navigation bar if needed for a more complex public site.

### 6.24 Avatar
Source: `src/components/Avatar`

Use cases:
- Admin user presence or audit log entries.

### 6.25 DateTime
Source: `src/components/DateTime`

Use cases:
- Consistent formatted timestamps in tables and detail views.

### 6.26 BrandSwitcher
Source: `src/components/BrandSwitcher`

Use cases:
- Internal tool for switching brand themes (optional in HFRE).

### 6.27 Typewriter
Source: `src/components/Typewriter`

Use cases:
- Hero headline effects on the public landing page (optional).

## 7. Page-Level Patterns

### 6.1 Public Form
- Use `Input` for all required fields.
- Primary action uses `Button` with `loading` during submit.
- Validation errors render via `Input` error prop.
- Success or error feedback via `Toaster`.

### 6.2 Results View
- Wrap result blocks in `Card`.
- Use `Status` for confidence level (High/Medium/Low).
- Use `Spinner` when waiting for async result fetch.

### 6.3 Admin Tables
- Use `Table` for submissions and analytics.
- Add row actions with `Button` variants `ghost` or `danger`.
- Use `Dialog` for delete confirmations.

### 6.4 Admin Forms
- Use `Fieldset` for grouping (login, prompt edit, filters).
- Use `Select` for filters, `Textarea` for prompt content.

## 8. Accessibility

- Always connect labels to inputs (`id` + `label` props).
- Use `aria-invalid` and error text via the component error props.
- Dialogs should use `onClose` and allow Escape/backdrop close.
- Tables provide aria labels and keyboard sortable headers.

## 9. Assets

VMF source repo: `https://github.com/StoryDevGA/VMF-v-1-client`.

Assets from VMF (icons, images) are not copied yet. If needed later, pull only the required files and keep paths consistent with component expectations.

Known asset list in VMF:
- `src/assets/images/icons/pinwheel.svg` (used by `Spinner` default type)
- `src/assets/images/icons/storylineOS-icon.png`
- `src/assets/images/icons/StoryLine-loading.png`
- `src/assets/images/icons/StoryLine-loading-black&white.png`
- `src/assets/images/logos/storylineOS-Logo.png`
- `src/assets/images/logos/StoryLineOS - Black.png`
- `src/assets/react.svg` (Vite demo asset, likely unused)

Note: `.bak` logo files exist in the VMF repo but should not be imported.

### 9.1 Asset Usage Map
- `pinwheel.svg` -> `Spinner` (default `type="pinwheel"`)
- `storylineOS-Logo.png` -> `Logo`, `Header`, `VMFNavbar` (primary brand mark)
- `StoryLineOS - Black.png` -> alternate logo for light backgrounds (optional)
- `storylineOS-icon.png` -> favicon/app icon (optional)
- `StoryLine-loading.png` and `StoryLine-loading-black&white.png` -> loading screens or full-page loader (optional)
