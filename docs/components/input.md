# Input Component

A professional input component with floating label animation that reduces in size and moves outside the input when focused or filled.

## Features

- ✅ **Floating Label Animation**: Label shrinks and moves outside on focus/value
- ✅ **Very Light Placeholder**: Placeholder displayed in extremely light text (30% opacity)
- ✅ **Multiple Variants**: default, outlined, filled
- ✅ **Three Sizes**: sm, md, lg
- ✅ **Icon Slots**: Optional left/right icons with automatic padding
- ✅ **Error States**: Visual error indication with messages
- ✅ **Helper Text**: Optional descriptive text below input
- ✅ **Required Field**: Asterisk indicator for required fields
- ✅ **Disabled State**: Full disabled support
- ✅ **Full Width Option**: Responsive width control
- ✅ **All Input Types**: text, email, password, number, tel, etc.
- ✅ **Ref Forwarding**: Access to underlying input element
- ✅ **Accessibility**: ARIA attributes and proper labeling

## Basic Usage

```jsx
import { Input } from '@/components/Input'

function MyForm() {
  return (
    <Input
      label="Email Address"
      placeholder="Enter your email"
      type="email"
      id="email"
    />
  )
}
```

## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `'text'` | HTML input type |
| `label` | `string` | - | Floating label text |
| `placeholder` | `string` | - | Very light placeholder text |
| `leftIcon` | `ReactNode` | - | Optional icon rendered before the text |
| `rightIcon` | `ReactNode` | - | Optional icon rendered after the text |
| `value` | `string` | - | Controlled value |
| `defaultValue` | `string` | - | Uncontrolled default value |
| `error` | `string` | - | Error message to display |
| `helperText` | `string` | - | Helper text below input |
| `disabled` | `boolean` | `false` | Disable the input |
| `required` | `boolean` | `false` | Mark as required field |
| `variant` | `'default' \| 'outlined' \| 'filled'` | `'default'` | Input style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `fullWidth` | `boolean` | `false` | Take full width of container |
| `className` | `string` | `''` | Additional CSS classes |
| `id` | `string` | - | Input ID (required for labels) |

## Examples

### Floating Label Effect

```jsx
{/* Label floats up and shrinks when focused or has value */}
<Input
  label="Full Name"
  placeholder="Enter your name"
  id="name"
/>
```

### With Error

```jsx
<Input
  label="Email"
  placeholder="email@example.com"
  type="email"
  error="Please enter a valid email address"
  id="email"
/>
```

### With Helper Text

```jsx
<Input
  label="Password"
  type="password"
  helperText="Must be at least 8 characters"
  id="password"
/>

<Input
  label="Search"
  placeholder="Search"
  leftIcon={<SearchIcon />}
  id="search"
/>
```

### Required Field

```jsx
<Input
  label="Username"
  placeholder="Choose a username"
  required
  id="username"
/>
```

### Sizes

```jsx
{/* Small */}
<Input label="Small" size="sm" id="small" />

{/* Medium (default) */}
<Input label="Medium" size="md" id="medium" />

{/* Large */}
<Input label="Large" size="lg" id="large" />
```

### Variants

```jsx
{/* Default */}
<Input label="Default" variant="default" id="default" />

{/* Outlined - Emphasized border */}
<Input label="Outlined" variant="outlined" id="outlined" />

{/* Filled - Subtle background */}
<Input label="Filled" variant="filled" id="filled" />
```

### Full Width

```jsx
<Input
  label="Full Width Input"
  placeholder="Takes full width of container"
  fullWidth
  id="full"
/>
```

### Input Types

```jsx
{/* Email */}
<Input label="Email" type="email" id="email" />

{/* Password */}
<Input label="Password" type="password" id="password" />

{/* Number */}
<Input label="Age" type="number" id="age" />

{/* Telephone */}
<Input label="Phone" type="tel" id="phone" />

{/* URL */}
<Input label="Website" type="url" id="url" />
```

### Disabled State

```jsx
<Input
  label="Disabled Input"
  value="Cannot edit this"
  disabled
  id="disabled"
/>
```

### Controlled Input

```jsx
function ControlledInput() {
  const [value, setValue] = useState('')

  return (
    <Input
      label="Controlled"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      id="controlled"
    />
  )
}
```

### With Ref

```jsx
function RefExample() {
  const inputRef = useRef(null)

  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <>
      <Input ref={inputRef} label="Focus Me" id="ref-input" />
      <Button onClick={focusInput}>Focus Input</Button>
    </>
  )
}
```

## Floating Label Behavior

The label automatically floats (shrinks and moves outside) when:
1. Input is focused (user clicks into it)
2. Input has a value (typed or default)

The label returns to normal position when:
1. Input loses focus AND
2. Input is empty

This provides a clean UX without redundant labels and placeholders.

## Placeholder Text

The placeholder prop renders text inside the input with:
- Very light color (30% opacity of secondary text)
- Only visible when input is empty
- Disappears when user types

This is different from the label, which becomes the floating label.

## Error Handling

When an error is present:
- Input border becomes red
- Error message displays below input
- Helper text is hidden (error takes priority)
- Input has `aria-invalid="true"`
- Error has `role="alert"` for screen readers

## Accessibility

- **Labels**: Properly associated with inputs via `htmlFor`/`id`
- **ARIA**: `aria-invalid`, `aria-describedby` for errors/helpers
- **Required**: Visual asterisk (*) and `required` attribute
- **Focus States**: Clear focus indicators
- **Screen Readers**: Errors announced with `role="alert"`
- **Keyboard**: Full keyboard navigation support

## Styling

Uses design system tokens:
- Border: 1px with 30% opacity
- Focus: Primary color with subtle shadow
- Placeholder: 30% opacity of secondary text
- Transitions: Smooth animations for label floating
- Reduced Motion: Respects `prefers-reduced-motion`

## Testing

Run tests:
```bash
npm test Input
```

37 comprehensive tests covering all functionality.

## Best Practices

1. **Always provide an id**: Required for label association
2. **Use label for UX**: Better than placeholder alone
3. **Show errors clearly**: Use error prop for validation messages
4. **Helper text for guidance**: Explain input requirements
5. **Required fields**: Mark with required prop
6. **Appropriate types**: Use correct input type for data
7. **Full width for forms**: Use fullWidth in form layouts
8. **Controlled for validation**: Use controlled inputs when validating

## Related Components

- **Button**: For form submissions
- **Fieldset**: For grouping multiple inputs
- **Dialog**: For modal forms
