# Fieldset Component

A professional fieldset component built on the native HTML `<fieldset>` element with legend that breaks the border and flex content layout.

## Features

- ✅ **Native HTML Fieldset**: Built on `<fieldset>` and `<legend>` elements
- ✅ **Border-Breaking Legend**: Legend naturally breaks the border
- ✅ **Flex Content Layout**: Content uses flexbox with wrap
- ✅ **Multiple Variants**: default, outlined, filled
- ✅ **Configurable Gap**: sm, md, lg, xl spacing options
- ✅ **Disabled State**: Native fieldset disabled functionality
- ✅ **Responsive Design**: Mobile-first with breakpoint adjustments
- ✅ **Theme Support**: Works with all color schemes
- ✅ **Uppercase Legend**: Professional text styling
- ✅ **1px Subtle Borders**: With 30% opacity

## Basic Usage

```jsx
import { Fieldset } from '@/components/Fieldset'

function MyForm() {
  return (
    <Fieldset>
      <Fieldset.Legend>Personal Information</Fieldset.Legend>
      <Fieldset.Content>
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Last Name" />
        <input type="email" placeholder="Email" />
      </Fieldset.Content>
    </Fieldset>
  )
}
```

## API Reference

### Fieldset (Container)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'outlined' \| 'filled'` | `'default'` | Fieldset style variant |
| `gap` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Gap between flex items |
| `disabled` | `boolean` | `false` | Disable all form controls inside |
| `className` | `string` | `''` | Additional CSS classes |

### Fieldset Sub-components

- `Fieldset.Legend` - Legend that breaks the border
- `Fieldset.Content` - Flex container for content (wraps automatically)

## Examples

### Simple Fieldset

```jsx
<Fieldset>
  <Fieldset.Legend>Contact Details</Fieldset.Legend>
  <Fieldset.Content>
    <input type="tel" placeholder="Phone" />
    <input type="email" placeholder="Email" />
  </Fieldset.Content>
</Fieldset>
```

### Variants

```jsx
{/* Default - Subtle 1px border */}
<Fieldset variant="default">
  <Fieldset.Legend>Default Style</Fieldset.Legend>
  <Fieldset.Content>
    <input type="text" />
  </Fieldset.Content>
</Fieldset>

{/* Outlined - Emphasized 2px border */}
<Fieldset variant="outlined">
  <Fieldset.Legend>Outlined Style</Fieldset.Legend>
  <Fieldset.Content>
    <input type="text" />
  </Fieldset.Content>
</Fieldset>

{/* Filled - Subtle background */}
<Fieldset variant="filled">
  <Fieldset.Legend>Filled Style</Fieldset.Legend>
  <Fieldset.Content>
    <input type="text" />
  </Fieldset.Content>
</Fieldset>
```

### Gap Sizes

```jsx
{/* Small gap */}
<Fieldset gap="sm">
  <Fieldset.Legend>Small Gap</Fieldset.Legend>
  <Fieldset.Content>
    <button>Button 1</button>
    <button>Button 2</button>
    <button>Button 3</button>
  </Fieldset.Content>
</Fieldset>

{/* Medium gap (default) */}
<Fieldset gap="md">
  <Fieldset.Legend>Medium Gap</Fieldset.Legend>
  <Fieldset.Content>
    <button>Button 1</button>
    <button>Button 2</button>
    <button>Button 3</button>
  </Fieldset.Content>
</Fieldset>

{/* Large gap */}
<Fieldset gap="lg">
  <Fieldset.Legend>Large Gap</Fieldset.Legend>
  <Fieldset.Content>
    <button>Button 1</button>
    <button>Button 2</button>
    <button>Button 3</button>
  </Fieldset.Content>
</Fieldset>

{/* Extra large gap */}
<Fieldset gap="xl">
  <Fieldset.Legend>Extra Large Gap</Fieldset.Legend>
  <Fieldset.Content>
    <button>Button 1</button>
    <button>Button 2</button>
    <button>Button 3</button>
  </Fieldset.Content>
</Fieldset>
```

### Disabled State

```jsx
<Fieldset disabled>
  <Fieldset.Legend>Disabled Form Section</Fieldset.Legend>
  <Fieldset.Content>
    <input type="text" placeholder="Disabled input" />
    <input type="email" placeholder="Disabled email" />
    <button>Disabled Button</button>
  </Fieldset.Content>
</Fieldset>
```

### Form with Multiple Fieldsets

```jsx
<form>
  <Fieldset variant="outlined">
    <Fieldset.Legend>Personal Information</Fieldset.Legend>
    <Fieldset.Content>
      <input type="text" placeholder="First Name" style={{ flex: '1 1 200px' }} />
      <input type="text" placeholder="Last Name" style={{ flex: '1 1 200px' }} />
      <input type="email" placeholder="Email" style={{ flex: '1 1 300px' }} />
      <input type="tel" placeholder="Phone" style={{ flex: '1 1 200px' }} />
    </Fieldset.Content>
  </Fieldset>

  <Fieldset variant="outlined" style={{ marginTop: '2rem' }}>
    <Fieldset.Legend>Address</Fieldset.Legend>
    <Fieldset.Content>
      <input type="text" placeholder="Street" style={{ flex: '1 1 100%' }} />
      <input type="text" placeholder="City" style={{ flex: '1 1 200px' }} />
      <input type="text" placeholder="State" style={{ flex: '1 1 100px' }} />
      <input type="text" placeholder="Zip" style={{ flex: '1 1 100px' }} />
    </Fieldset.Content>
  </Fieldset>

  <Fieldset variant="filled" style={{ marginTop: '2rem' }}>
    <Fieldset.Legend>Preferences</Fieldset.Legend>
    <Fieldset.Content>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" />
        Newsletter
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" />
        Updates
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" />
        Promotions
      </label>
    </Fieldset.Content>
  </Fieldset>
</form>
```

### Button Group with Fieldset

```jsx
<Fieldset variant="outlined" gap="sm">
  <Fieldset.Legend>Actions</Fieldset.Legend>
  <Fieldset.Content>
    <Button>Save</Button>
    <Button variant="outline">Cancel</Button>
    <Button variant="danger">Delete</Button>
  </Fieldset.Content>
</Fieldset>
```

### Responsive Form Fields

```jsx
<Fieldset gap="lg">
  <Fieldset.Legend>Registration Form</Fieldset.Legend>
  <Fieldset.Content>
    <div style={{ flex: '1 1 300px' }}>
      <label>Username</label>
      <input type="text" style={{ width: '100%' }} />
    </div>
    <div style={{ flex: '1 1 300px' }}>
      <label>Email</label>
      <input type="email" style={{ width: '100%' }} />
    </div>
    <div style={{ flex: '1 1 300px' }}>
      <label>Password</label>
      <input type="password" style={{ width: '100%' }} />
    </div>
    <div style={{ flex: '1 1 100%' }}>
      <Button fullWidth>Register</Button>
    </div>
  </Fieldset.Content>
</Fieldset>
```

## Responsive Behavior

### Mobile (<768px)
- Compact padding
- Flex items wrap to stack vertically
- Smaller legend text

### Tablet (768px - 1023px)
- Increased padding
- Standard legend size
- Flex layout begins to show side-by-side items

### Desktop (≥1024px)
- Maximum padding
- Full flex layout with optimal spacing

## Flex Content Layout

The `Fieldset.Content` component uses flexbox with the following properties:
- `display: flex`
- `flex-wrap: wrap`
- `align-items: flex-start`
- `width: 100%`

This means:
1. Items flow horizontally by default
2. Items wrap to the next line when space runs out
3. Items align to the top
4. Container uses full available width

### Making Items Responsive

Use flex properties on child elements:

```jsx
<Fieldset.Content>
  {/* Always full width */}
  <input style={{ flex: '1 1 100%' }} />

  {/* Minimum 200px, grows to fill space */}
  <input style={{ flex: '1 1 200px' }} />

  {/* Fixed width, doesn't grow */}
  <button style={{ flex: '0 0 120px' }}>Submit</button>
</Fieldset.Content>
```

## Gap Reference

| Gap | Spacing |
|-----|---------|
| `sm` | `--spacing-sm` (0.5rem) |
| `md` | `--spacing-md` (1rem) |
| `lg` | `--spacing-lg` (1.5rem) |
| `xl` | `--spacing-xl` (2rem) |

## Legend Breaking the Border

The legend naturally breaks the fieldset border using native HTML behavior. The legend sits "on" the border line, creating a visual break:

```
┌──── LEGEND ────────────────┐
│                            │
│  Content goes here         │
│                            │
└────────────────────────────┘
```

This is achieved through:
1. Native `<fieldset>` and `<legend>` elements
2. No special CSS tricks needed
3. Fully accessible and semantic

## Disabled Behavior

When a fieldset is disabled:
- All form controls inside are automatically disabled
- Visual opacity is reduced (60%)
- Cursor changes to `not-allowed`
- Legend color becomes secondary text color
- Pointer events are disabled on content

This uses native fieldset functionality for maximum accessibility.

## Styling

The Fieldset component uses design system tokens:
- Border: 1px with 30% opacity (default)
- Border: 2px solid (outlined)
- Background: Subtle primary tint (filled)
- Legend: Uppercase, semibold, small size
- Transitions: Standard timing functions

### Custom Styling

```jsx
<Fieldset className="custom-fieldset">
  <Fieldset.Legend className="custom-legend">
    Custom Styled
  </Fieldset.Legend>
  <Fieldset.Content className="custom-content">
    Content
  </Fieldset.Content>
</Fieldset>
```

## Testing

Run tests:
```bash
npm test Fieldset
```

27 comprehensive tests covering all functionality.

## Best Practices

1. **Use for form sections**: Group related form fields
2. **Descriptive legends**: Make legend text clear and concise
3. **Logical grouping**: Group fields that belong together
4. **Responsive children**: Use flex properties on child elements
5. **Disabled state**: Disable entire sections when appropriate
6. **Gap selection**: Choose gap based on content density
7. **Variant choice**: Use outlined for emphasis, filled for subtle grouping

## Common Use Cases

### Form Sections
```jsx
<form>
  <Fieldset>
    <Fieldset.Legend>Shipping Address</Fieldset.Legend>
    <Fieldset.Content>
      {/* Address fields */}
    </Fieldset.Content>
  </Fieldset>

  <Fieldset>
    <Fieldset.Legend>Payment Information</Fieldset.Legend>
    <Fieldset.Content>
      {/* Payment fields */}
    </Fieldset.Content>
  </Fieldset>
</form>
```

### Settings Panels
```jsx
<Fieldset variant="filled">
  <Fieldset.Legend>Notification Settings</Fieldset.Legend>
  <Fieldset.Content>
    <label><input type="checkbox" /> Email</label>
    <label><input type="checkbox" /> SMS</label>
    <label><input type="checkbox" /> Push</label>
  </Fieldset.Content>
</Fieldset>
```

### Action Groups
```jsx
<Fieldset variant="outlined" gap="sm">
  <Fieldset.Legend>File Actions</Fieldset.Legend>
  <Fieldset.Content>
    <Button size="sm">Download</Button>
    <Button size="sm" variant="outline">Share</Button>
    <Button size="sm" variant="danger">Delete</Button>
  </Fieldset.Content>
</Fieldset>
```

## Accessibility

- **Native Elements**: Uses `<fieldset>` and `<legend>` for semantic HTML
- **Screen Readers**: Fieldsets announce grouped form controls
- **Keyboard Navigation**: Native tab order works correctly
- **Disabled State**: Native disabled attribute disables all controls
- **Focus Management**: Focus works as expected with native elements
- **ARIA**: No additional ARIA needed (native elements are accessible)

## Related Components

- **Button**: Use in fieldset content for action groups
- **Card**: For non-form content grouping
- **Accordion**: For collapsible content sections
