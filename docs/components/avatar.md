# Avatar Component

A flexible avatar component for displaying user profile pictures, initials, or fallback icons.

## Features

- ✅ **Image Support**: Display user photos with automatic fallback
- ✅ **Initials Generation**: Automatic initials from user names
- ✅ **Multiple Sizes**: xs, sm, md, lg, xl
- ✅ **Multiple Shapes**: circle, square, rounded
- ✅ **Status Indicators**: online, offline, away, busy
- ✅ **Fallback Handling**: Graceful degradation when images fail
- ✅ **Icon Fallback**: Person icon when no name or image is provided
- ✅ **Accessible**: Proper alt text, ARIA labels, and semantic HTML
- ✅ **Theme Support**: Works with all color schemes
- ✅ **Hover Effects**: Subtle scale animation

## Basic Usage

```jsx
import { Avatar } from '@/components/Avatar'

function UserProfile() {
  return <Avatar name="John Doe" />
}
```

## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image URL |
| `alt` | `string` | `name` or `'Avatar'` | Alt text for image |
| `name` | `string` | - | User name (for initials and alt text) |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Avatar size |
| `shape` | `'circle' \| 'square' \| 'rounded'` | `'circle'` | Avatar shape |
| `status` | `'online' \| 'offline' \| 'away' \| 'busy'` | - | Status indicator |
| `className` | `string` | `''` | Additional CSS classes |

## Examples

### With Image

```jsx
<Avatar
  src="/images/user.jpg"
  alt="John Doe"
  name="John Doe"
/>
```

### With Initials

```jsx
<Avatar name="Jane Smith" />
```

### Different Sizes

```jsx
<Avatar name="John Doe" size="xs" />
<Avatar name="John Doe" size="sm" />
<Avatar name="John Doe" size="md" />
<Avatar name="John Doe" size="lg" />
<Avatar name="John Doe" size="xl" />
```

### Different Shapes

```jsx
<Avatar name="John Doe" shape="circle" />
<Avatar name="John Doe" shape="square" />
<Avatar name="John Doe" shape="rounded" />
```

### With Status Indicator

```jsx
<Avatar name="John Doe" status="online" />
<Avatar name="Jane Smith" status="away" />
<Avatar name="Bob Wilson" status="busy" />
<Avatar name="Alice Brown" status="offline" />
```

### Combined Features

```jsx
<Avatar
  src="/images/user.jpg"
  name="John Doe"
  size="lg"
  shape="rounded"
  status="online"
/>
```

### Fallback Behavior

```jsx
{/* If image fails to load, initials will be shown */}
<Avatar
  src="/broken-link.jpg"
  name="John Doe"
/>

{/* If no name and no image, person icon is used */}
<Avatar />
```

## Sizes

| Size | Dimensions | Use Case |
|------|------------|----------|
| `xs` | 24×24px | Compact lists, tags |
| `sm` | 32×32px | Inline mentions, small lists |
| `md` | 40×40px | Default, general use |
| `lg` | 56×56px | User cards, profiles |
| `xl` | 80×80px | Profile pages, headers |

## Status Colors

| Status | Color | Meaning |
|--------|-------|---------|
| `online` | Green | User is online |
| `offline` | Gray | User is offline |
| `away` | Amber | User is away |
| `busy` | Red | User is busy/do not disturb |

## Initials Generation

The Avatar component automatically generates initials from names:

| Name | Initials |
|------|----------|
| "John Doe" | JD |
| "Madonna" | MA |
| "John Michael Doe" | JD (first + last) |
| "  Jane   Smith  " | JS (handles extra spaces) |
| "" or undefined | ? (fallback) |

## Accessibility

- **Images**: Use meaningful alt text via `alt` prop or fallback to `name`
- **Initials**: Include `aria-label` with full name
- **Status**: Status indicators have `role="status"` and descriptive `aria-label`
- **Hover Effects**: Respect `prefers-reduced-motion` setting
- **High Contrast**: Increased border width in high contrast mode

## Styling

The Avatar component uses design system tokens:
- Background: `--color-primary-100`
- Text: `--color-primary-700`
- Border: Subtle 1px with 30% opacity
- Status colors: Semantic colors for each status

### Custom Styling

```jsx
<Avatar
  name="John Doe"
  className="custom-avatar"
  style={{ boxShadow: 'var(--shadow-lg)' }}
/>
```

## Testing

Run tests:
```bash
npm test Avatar
```

31 comprehensive tests covering all functionality.

## Related Components

- **Button**: Can wrap Avatar for clickable profile pictures
- **Link**: Can wrap Avatar for profile links
