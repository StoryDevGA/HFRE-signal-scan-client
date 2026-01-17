# Radio Component

A custom-styled, accessible radio button component for single-selection choices within a group.

## Features

- ✅ **Custom Styling**: Visually consistent across browsers
- ✅ **Multiple Sizes**: sm, md, lg
- ✅ **Controlled Component**: Manages checked state via props
- ✅ **Radio Group Support**: Ensures only one radio button in a group can be selected
- ✅ **Disabled State**: Prevents interaction and applies visual styling
- ✅ **Accessible**: Proper ARIA attributes and keyboard navigation
- ✅ **Theme Support**: Works with all color schemes
- ✅ **Production-Ready**: Comprehensive tests, clean code

## Basic Usage

```jsx
import { Radio } from '@/components/Radio'
import { useState } from 'react'

function MyForm() {
  const [selectedOption, setSelectedOption] = useState('option1')

  return (
    <div>
      <Radio
        id="radio-option1"
        name="my-options"
        value="option1"
        label="Option 1"
        checked={selectedOption === 'option1'}
        onChange={(e) => setSelectedOption(e.target.value)}
      />
      <Radio
        id="radio-option2"
        name="my-options"
        value="option2"
        label="Option 2"
        checked={selectedOption === 'option2'}
        onChange={(e) => setSelectedOption(e.target.value)}
      />
      <Radio
        id="radio-option3"
        name="my-options"
        value="option3"
        label="Option 3"
        checked={selectedOption === 'option3'}
        onChange={(e) => setSelectedOption(e.target.value)}
      />
    </div>
  )
}
```

## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Unique ID for the radio button input (required for accessibility) |
| `name` | `string` | - | Name of the radio group (required for single selection behavior) |
| `value` | `string` | - | Value associated with the radio button |
| `label` | `string` | - | Text label for the radio button |
| `checked` | `boolean` | `false` | Controls the checked state of the radio button |
| `onChange` | `(event) => void` | - | Callback fired when the checked state changes |
| `disabled` | `boolean` | `false` | If `true`, the radio button will be disabled |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the radio button |
| `className` | `string` | `''` | Additional CSS classes |

## Examples

### Sizes

```jsx
import { Radio } from '@/components/Radio'
import { useState } from 'react'

function RadioSizes() {
  const [selectedSize, setSelectedSize] = useState('md')

  return (
    <>
      <Radio
        id="radio-size-sm"
        name="radio-sizes"
        value="sm"
        label="Small Radio"
        size="sm"
        checked={selectedSize === 'sm'}
        onChange={(e) => setSelectedSize(e.target.value)}
      />
      <Radio
        id="radio-size-md"
        name="radio-sizes"
        value="md"
        label="Medium Radio"
        size="md"
        checked={selectedSize === 'md'}
        onChange={(e) => setSelectedSize(e.target.value)}
      />
      <Radio
        id="radio-size-lg"
        name="radio-sizes"
        value="lg"
        label="Large Radio"
        size="lg"
        checked={selectedSize === 'lg'}
        onChange={(e) => setSelectedSize(e.target.value)}
      />
    </>
  )
}
```

### States

```jsx
import { Radio } from '@/components/Radio'
import { useState } from 'react'

function RadioStates() {
  const [selectedState, setSelectedState] = useState('option-active')

  return (
    <>
      <Radio
        id="radio-state-active"
        name="radio-states"
        value="option-active"
        label="Active Radio"
        checked={selectedState === 'option-active'}
        onChange={(e) => setSelectedState(e.target.value)}
      />
      <Radio
        id="radio-state-disabled"
        name="radio-states"
        value="option-disabled"
        label="Disabled Radio"
        disabled
        checked={selectedState === 'option-disabled'}
        onChange={(e) => setSelectedState(e.target.value)}
      />
      <Radio
        id="radio-state-disabled-checked"
        name="radio-states"
        value="option-disabled-checked"
        label="Disabled & Checked"
        disabled
        checked={true} // Force checked for example
        onChange={(e) => setSelectedState(e.target.value)}
      />
    </>
  )
}
```

### Radio Group

```jsx
import { Radio } from '@/components/Radio'
import { useState } from 'react'

function RadioGroupExample() {
  const [deliveryOption, setDeliveryOption] = useState('standard')

  return (
    <fieldset>
      <legend>Choose Delivery Option:</legend>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Radio
          id="delivery-standard"
          name="delivery"
          value="standard"
          label="Standard Delivery (3-5 days)"
          checked={deliveryOption === 'standard'}
          onChange={(e) => setDeliveryOption(e.target.value)}
        />
        <Radio
          id="delivery-express"
          name="delivery"
          value="express"
          label="Express Delivery (1-2 days)"
          checked={deliveryOption === 'express'}
          onChange={(e) => setDeliveryOption(e.target.value)}
        />
        <Radio
          id="delivery-pickup"
          name="delivery"
          value="pickup"
          label="Store Pickup (Same day)"
          checked={deliveryOption === 'pickup'}
          onChange={(e) => setDeliveryOption(e.target.value)}
          disabled
        />
      </div>
    </fieldset>
  )
}
```

## Accessibility

- **Keyboard Support**:
  - `Tab`: Navigates between radio groups.
  - `Arrow Keys`: Navigates within a radio group (when one radio is focused).
  - `Space`: Toggles the checked state of the focused radio button.
- **ARIA Attributes**: The native `<input type="radio">` inherently handles ARIA attributes.
  - `aria-checked="true/false"`: Automatically set by the browser.
  - The `label` is associated with the input via `htmlFor` and `id`.
  - Grouping radio buttons within a `<fieldset>` with a `<legend>` provides additional semantic context for screen readers.
- **Focus Visible**: Clear focus indicator (using `focus-visible`).

## Styling

The Radio component uses design system tokens:
- `--color-primary`: For checked and focus states.
- `--color-border`: For borders.
- `--color-surface`: For background.
- `--transition-fast`: For smooth animations.

### Custom Styling

```jsx
<Radio
  id="custom-radio"
  name="custom-group"
  value="custom"
  label="Custom Styled"
  className="my-custom-radio"
/>
```

```css
/* In your custom CSS file */
.my-custom-radio .radio-button {
  border-color: var(--color-warning);
}

.my-custom-radio .radio-input:checked + .radio-button .radio-inner {
  background-color: var(--color-warning);
}
```

## Testing

Run tests:
```bash
npm test Radio
```

Tests cover:
- Basic rendering
- Toggling checked state
- Disabled state
- Keyboard navigation
- Size application
- Radio group behavior (only one selected)

## Related Components

- **Tickbox**: For multi-selection choices.
- **Input**: For text input fields.

## Changelog

### v1.0.0 (Current)
- Initial release with custom styling and sizes.
- Full accessibility support.
- Comprehensive tests.
