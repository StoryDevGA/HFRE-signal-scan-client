# Typewriter Component

Displays text with a typewriter effect.

## Features

- ✅ **Configurable Speed**: Control typing speed and initial delay
- ✅ **Looping**: Optional loop with pause between cycles
- ✅ **Blinking Cursor**: Toggle cursor on/off
- ✅ **Accessible**: Polite live region and semantic markup
- ✅ **Theme-Aware**: Uses design tokens for typography and color

## Basic Usage

```jsx
import { Typewriter } from '@/components/Typewriter'

<Typewriter text="StoryLineOS" />
```

## API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `''` | Text to render with the typewriter effect |
| `speed` | `number` | `100` | Delay in ms per character |
| `delay` | `number` | `0` | Initial delay before typing starts (ms) |
| `loop` | `boolean` | `false` | Restart typing when finished |
| `pauseBetween` | `number` | `1500` | Pause before restarting when looping (ms) |
| `showCursor` | `boolean` | `true` | Toggle blinking cursor |
| `className` | `string` | `''` | Additional CSS classes |
| `ariaLabel` | `string` | `undefined` | Optional accessible label for the live region |

## Examples

### Faster Typing
```jsx
<Typewriter text="Fast typing" speed={50} />
```

### With Delay and Loop
```jsx
<Typewriter
  text="Looping message"
  delay={300}
  loop
  pauseBetween={1000}
/>
```

### Without Cursor
```jsx
<Typewriter text="No cursor here" showCursor={false} />
```

## Accessibility

- Uses `aria-live="polite"` to announce updates without interruption.
- Cursor is marked `aria-hidden`.
- Tabular numbers and monospace font for stable layout.

## Styling

- BEM classes: `.typewriter`, `.typewriter__text`, `.typewriter__cursor`
- Uses design tokens for font, spacing, and colors
- Respects `prefers-reduced-motion` by disabling cursor animation

## Related Components

- **DateTime**: Another live-updating display component.
