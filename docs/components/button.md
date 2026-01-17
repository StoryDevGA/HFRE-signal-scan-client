# Button Component

A fully accessible, responsive button component with multiple variants, sizes, and states.

## Features

- ✅ **5 Variants**: Primary, Secondary, Outline, Ghost, Danger
- ✅ **3 Sizes**: Small, Medium, Large
- ✅ **Loading State**: Built-in spinner
- ✅ **Icon Support**: Left/right icons and icon-only buttons
- ✅ **Fully Accessible**: ARIA attributes, keyboard navigation
- ✅ **Touch-Friendly**: Minimum 44px touch targets (48px on mobile)
- ✅ **Responsive**: Adapts to all screen sizes
- ✅ **Theme Support**: Works with all color schemes
- ✅ **Production-Ready**: Comprehensive tests, DRY code

## Basic Usage

```jsx
import { Button } from '@/components/Button'

function MyComponent() {
  return (
    <Button onClick={() => console.log('Clicked!')}>
      Click Me
    </Button>
  )
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Button content |
| `leftIcon` | `ReactNode` | - | Optional icon displayed before the text |
| `rightIcon` | `ReactNode` | - | Optional icon displayed after the text |
| `iconOnly` | `boolean` | `false` | Render as icon-only button (provides tight padding; requires `aria-label`) |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disables the button |
| `loading` | `boolean` | `false` | Shows loading spinner |
| `fullWidth` | `boolean` | `false` | Makes button full width |
| `doubleOutline` | `boolean` | `false` | Adds double outline effect for emphasis |
| `square` | `boolean` | `false` | Removes border radius for sharp corners |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `onClick` | `(event) => void` | - | Click handler |
| `className` | `string` | `''` | Additional CSS classes |
| `...props` | `HTMLButtonElement` | - | All standard button attributes |

## Variants

### Primary (Default)
Main call-to-action buttons.

```jsx
<Button variant="primary">Primary Action</Button>
```

**Use for:** Primary actions, main CTAs, submit buttons

### Secondary
Less prominent actions.

```jsx
<Button variant="secondary">Secondary Action</Button>
```

**Use for:** Alternative actions, cancel buttons, secondary flows

### Outline
Subtle emphasis with border.

```jsx
<Button variant="outline">Outline Action</Button>
```

**Use for:** Tertiary actions, optional features, toggles

### Ghost
Minimal styling.

```jsx
<Button variant="ghost">Ghost Action</Button>
```

**Use for:** Navigation, inline actions, icon buttons

### Danger
Destructive or dangerous actions.

```jsx
<Button variant="danger">Delete</Button>
```

**Use for:** Delete, remove, destructive operations

## Sizes

### Small
```jsx
<Button size="sm">Small Button</Button>
```
- Min height: 36px (40px on mobile)
- Use for: Compact UIs, inline actions

### Medium (Default)
```jsx
<Button size="md">Medium Button</Button>
```
- Min height: 44px (48px on mobile)
- Use for: Most buttons, forms

### Large
```jsx
<Button size="lg">Large Button</Button>
```
- Min height: 52px (56px on mobile)
- Use for: Hero sections, mobile primary actions

## States

### Disabled
```jsx
<Button disabled>Disabled Button</Button>
```
- Cannot be clicked
- Visually dimmed (50% opacity)
- `aria-disabled="true"`

### Loading
```jsx
const [loading, setLoading] = useState(false)

<Button
  loading={loading}
  onClick={async () => {
    setLoading(true)
    await saveData()
    setLoading(false)
  }}
>
  Save
</Button>
```
- Shows spinner
- Content hidden but maintains layout
- Button disabled during loading
- `aria-busy="true"`

### Full Width
```jsx
<Button fullWidth>Full Width Button</Button>
```
- Takes 100% of container width
- Useful for mobile layouts, forms

### Double Outline
```jsx
<Button variant="outline" doubleOutline>
  Enhanced Outline
</Button>

<Button variant="primary" doubleOutline>
  Primary with Double Border
</Button>
```
- Adds visual emphasis with double border effect
- Works with any variant
- Uses box-shadow for the second outline
- Particularly effective with `outline` variant
- Automatically adjusts padding to compensate for thicker border

**Best use cases:**
- Call-to-action buttons that need extra emphasis
- Selected or active state in button groups
- Important actions that require visual distinction

### Square (No Border Radius)
```jsx
<Button square>
  Square Button
</Button>

<Button variant="primary" square>
  Sharp Corners
</Button>

// Combine with other modifiers
<Button variant="outline" square doubleOutline>
  Square Double Outline
</Button>
```
- Removes all border radius for sharp, 90-degree corners
- Works with any variant and size
- Can combine with other modifiers (doubleOutline, fullWidth, etc.)
- Modern, minimalist aesthetic

**Best use cases:**
- Modern, minimalist designs
- Data tables and grids where alignment is important
- Technical or professional interfaces
- Matching design systems that prefer sharp corners

## Examples

### Form Submit Button
```jsx
<form onSubmit={handleSubmit}>
  <input type="email" name="email" />
  <Button
    type="submit"
    variant="primary"
    size="lg"
    fullWidth
  >
    Sign Up
  </Button>
</form>
```

### Async Action with Loading
```jsx
function SaveButton() {
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await api.save()
      toast.success('Saved!')
    } catch (error) {
      toast.error('Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSave}
      loading={loading}
      disabled={!hasChanges}
    >
      {loading ? 'Saving...' : 'Save Changes'}
    </Button>
  )
}
```

### Confirm Dialog
```jsx
function DeleteDialog() {
  return (
    <div className="dialog">
      <p>Are you sure you want to delete this item?</p>
      <div className="dialog-actions">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </div>
  )
}
```

### Button Group
```jsx
<div className="flex gap-md">
  <Button variant="outline">Cancel</Button>
  <Button variant="secondary">Save Draft</Button>
  <Button variant="primary">Publish</Button>
</div>
```

### Icon Button
```jsx
<Button variant="ghost" size="sm" aria-label="Close">
  <CloseIcon />
</Button>

<Button
  variant="primary"
  leftIcon={<SaveIcon />}
  rightIcon={<ArrowRightIcon />}
>
  Save & Continue
</Button>

<Button
  iconOnly
  aria-label="Settings"
  leftIcon={<SettingsIcon />}
/>
```

## Accessibility

### Keyboard Support
- **Space** or **Enter**: Activates the button
- **Tab**: Focuses the button
- **Shift+Tab**: Moves focus to previous element

### Screen Readers
- Announces button text
- Announces disabled state
- Announces loading state (`aria-busy`)
- Supports custom `aria-label` and `aria-describedby`

### ARIA Attributes
```jsx
<Button
  aria-label="Delete item"
  aria-describedby="delete-warning"
  disabled={isDisabled}
  loading={isLoading}
>
  Delete
</Button>
```

- `aria-disabled`: Set when disabled or loading
- `aria-busy`: Set when loading
- Accepts all standard ARIA attributes

### Focus Visible
- Clear focus indicator (2px outline)
- Respects `:focus-visible` for keyboard-only focus
- Customizable via `--color-border-focus` token

## Responsive Behavior

### Mobile (< 768px)
- Increased touch targets (48px minimum)
- Larger padding for easier tapping
- Full-width recommended for primary actions

### Tablet (768px - 1023px)
- Standard touch targets (44px)
- Default padding

### Desktop (≥ 1024px)
- Slightly larger padding for better visual balance
- Hover states enabled

## Theming

Button automatically adapts to theme changes:

```jsx
// Light theme
<Button variant="primary">Click Me</Button>

// Dark theme (same code, different appearance)
<html data-theme="dark">
  <Button variant="primary">Click Me</Button>
</html>
```

Uses semantic color tokens:
- `--color-action-primary`
- `--color-action-primary-hover`
- `--color-text-inverse`
- `--color-border-focus`

## Best Practices

### ✅ DO

```jsx
// Clear, action-oriented labels
<Button>Save Changes</Button>

// Loading state for async operations
<Button loading={isSaving}>Save</Button>

// Appropriate variants for context
<Button variant="danger">Delete Account</Button>

// Accessible icon buttons
<Button aria-label="Close dialog">
  <CloseIcon />
</Button>
```

### ❌ DON'T

```jsx
// Vague labels
<Button>OK</Button>
<Button>Click Here</Button>

// Missing loading states
<Button onClick={async () => await save()}>Save</Button>

// Wrong variant for action
<Button variant="primary">Delete Account</Button>

// Icon-only without label
<Button>
  <CloseIcon />
</Button>
```

## Testing

Button is fully tested with 40+ test cases covering:
- All variants and sizes
- Disabled and loading states
- User interactions (click, keyboard)
- Accessibility attributes
- Edge cases

Run tests:
```bash
npm test Button
```

## File Structure

```
src/components/Button/
├── Button.jsx          # Component logic
├── Button.css          # Styles (BEM naming)
├── Button.test.jsx     # Comprehensive tests
└── index.js            # Barrel export
```

## Design System Integration

Button uses design system tokens for:
- ✅ Spacing (`--spacing-*`)
- ✅ Typography (`--font-*`)
- ✅ Colors (`--color-*`)
- ✅ Borders (`--border-*`)
- ✅ Transitions (`--transition-*`)

Changes to design tokens automatically update all buttons.

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Graceful degradation for older browsers

## Performance

- **Lightweight**: < 2KB minified + gzipped
- **CSS-in-CSS**: No runtime CSS-in-JS overhead
- **Tree-shakeable**: Only import what you use
- **No dependencies**: Pure React component

## Migration from HTML Button

```jsx
// Before
<button
  className="btn btn-primary"
  onClick={handleClick}
  disabled={isDisabled}
>
  Click Me
</button>

// After
<Button
  variant="primary"
  onClick={handleClick}
  disabled={isDisabled}
>
  Click Me
</Button>
```

## Related Components

- **IconButton**: Button optimized for icons (coming soon)
- **ButtonGroup**: Group multiple buttons (coming soon)
- **LinkButton**: Button that looks like a link (coming soon)

## Changelog

### v1.0.0 (Current)
- Initial release
- 5 variants, 3 sizes
- Loading and disabled states
- Full accessibility support
- Responsive design
- Theme support
