# Horizontal Scroll Component

A simple, full-width horizontally scrollable container with optional snap alignment.

## Features

- ✅ **Horizontal Overflow**: Smooth horizontal scrolling for any children
- ✅ **Snap Support**: Optional scroll-snap alignment for clean layouts
- ✅ **Full Width**: Container spans available width
- ✅ **Touch-Friendly**: Native touch scrolling on mobile devices
- ✅ **Design Tokens**: Uses spacing from the design system
- ✅ **Accessible**: Labeled region with proper ARIA attributes
- ✅ **Custom Scrollbar**: Styled scrollbar for webkit browsers

## Basic Usage

```jsx
import { HorizontalScroll } from '@/components/HorizontalScroll'
import { Card } from '@/components/Card'

function FeatureRail() {
  return (
    <HorizontalScroll ariaLabel="Feature rail" gap="lg">
      {[1, 2, 3].map((n) => (
        <Card key={n} variant="outlined" style={{ maxWidth: '280px', flex: '0 0 auto' }}>
          <Card.Header>Item {n}</Card.Header>
          <Card.Body>Scrollable content {n}</Card.Body>
        </Card>
      ))}
    </HorizontalScroll>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Spacing between items |
| `snap` | `boolean` | `false` | Enable CSS scroll-snap alignment |
| `ariaLabel` | `string` | `'Horizontal content'` | Accessible label for the scroll region |
| `className` | `string` | `''` | Additional wrapper classes |
| `...props` | `div` | - | Standard div attributes |

## Best Practices

- Set a maximum width on child items (e.g., `maxWidth: '280px'`) for consistent sizing
- Use `flex: '0 0 auto'` on children to prevent them from shrinking
- Use `ariaLabel` to describe the content (e.g., "Product carousel", "Feature highlights")
- Enable `snap` for card rails where alignment matters
- Use different gap sizes (`sm`, `md`, `lg`, `xl`) to control spacing between items

## Related Components

- **Card**: Commonly used as children in horizontal rails.
- **Tooltip**: Add context to actions within scrolled items.
- **Toaster**: Provide feedback for actions triggered from items in the rail.
