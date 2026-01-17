# Tickbox Component

A custom-styled, accessible checkbox component that supports checked, unchecked, and indeterminate states.

## Features

- ✅ **Custom Styling**: Visually consistent across browsers
- ✅ **Multiple Sizes**: sm, md, lg
- ✅ **Controlled Component**: Manages checked state via props
- ✅ **Indeterminate State**: Visually represents partial selection
- ✅ **Disabled State**: Prevents interaction and applies visual styling
- ✅ **Accessible**: Proper ARIA attributes and keyboard navigation
- ✅ **Theme Support**: Works with all color schemes
- ✅ **Production-Ready**: Comprehensive tests, clean code

## Basic Usage

```jsx
import { Tickbox } from '@/components/Tickbox'
import { useState } from 'react'

function MyForm() {
  const [agreed, setAgreed] = useState(false)

  return (
    <Tickbox
      id="agree-terms"
      label="I agree to the terms and conditions"
      checked={agreed}
      onChange={(e) => setAgreed(e.target.checked)}
    />
  )
}
```

## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Unique ID for the checkbox input (required for accessibility) |
| `label` | `string` | - | Text label for the checkbox |
| `checked` | `boolean` | `false` | Controls the checked state of the checkbox |
| `onChange` | `(event) => void` | - | Callback fired when the checked state changes |
| `disabled` | `boolean` | `false` | If `true`, the tickbox will be disabled |
| `indeterminate` | `boolean` | `false` | If `true`, the tickbox will be in an indeterminate state |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the tickbox |
| `className` | `string` | `''` | Additional CSS classes |

## Examples

### Sizes

```jsx
import { Tickbox } from '@/components/Tickbox'

function TickboxSizes() {
  return (
    <>
      <Tickbox id="size-sm" label="Small Tickbox" size="sm" />
      <Tickbox id="size-md" label="Medium Tickbox" size="md" />
      <Tickbox id="size-lg" label="Large Tickbox" size="lg" />
    </>
  )
}
```

### States

```jsx
import { Tickbox } from '@/components/Tickbox'
import { useState } from 'react'

function TickboxStates() {
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(true)
  const [checked3, setChecked3] = useState(false) // For indeterminate example

  return (
    <>
      <Tickbox
        id="state-unchecked"
        label="Unchecked Tickbox"
        checked={checked1}
        onChange={(e) => setChecked1(e.target.checked)}
      />
      <Tickbox
        id="state-checked"
        label="Checked Tickbox"
        checked={checked2}
        onChange={(e) => setChecked2(e.target.checked)}
      />
      <Tickbox
        id="state-indeterminate"
        label="Indeterminate Tickbox"
        indeterminate={true}
        checked={checked3} // checked prop still needed for native input
        onChange={(e) => setChecked3(e.target.checked)}
      />
      <Tickbox id="state-disabled" label="Disabled Tickbox" disabled />
      <Tickbox id="state-disabled-checked" label="Disabled & Checked" disabled checked />
      <Tickbox id="state-disabled-indeterminate" label="Disabled & Indeterminate" disabled indeterminate />
    </>
  )
}
```

## Accessibility

- **Keyboard Support**:
  - `Tab`: Focuses the tickbox.
  - `Space`: Toggles the checked state.
- **ARIA Attributes**: The native `<input type="checkbox">` inherently handles ARIA attributes.
  - `aria-checked="true/false/mixed"`: Automatically set by the browser for `checked` and `indeterminate` states.
  - The `label` is associated with the input via `htmlFor` and `id`.
- **Focus Visible**: Clear focus indicator (using `focus-visible`).

## Styling

The Tickbox component uses design system tokens:
- `--color-primary`: For checked and focus states.
- `--color-border`: For borders.
- `--color-surface`: For background.
- `--color-text-inverse`: For the checkmark icon.
- `--transition-fast`: For smooth animations.

### Custom Styling

```jsx
<Tickbox
  id="custom-tickbox"
  label="Custom Styled"
  className="my-custom-tickbox"
/>
```

```css
/* In your custom CSS file */
.my-custom-tickbox .tickbox-box {
  border-color: var(--color-warning);
}

.my-custom-tickbox .tickbox-input:checked + .tickbox-box {
  background-color: var(--color-warning);
  border-color: var(--color-warning);
}
```

## Testing

Run tests:
```bash
npm test Tickbox
```

Tests cover:
- Basic rendering
- Toggling checked state
- Disabled state
- Keyboard navigation
- Size application
- Indeterminate state behavior

## Related Components

- **Input**: For text input fields.
- **Button**: For actions and submissions.

## Changelog

### v1.0.0 (Current)
- Initial release with custom styling, sizes, and indeterminate state.
- Full accessibility support.
- Comprehensive tests.
