# Dialog Component

A professional, accessible dialog component built on the native HTML `<dialog>` element with smooth animations and focus management.

## Features

- ✅ **Native HTML Dialog**: Built on `<dialog>` element for best accessibility
- ✅ **Multiple Sizes**: sm, md, lg, xl, full
- ✅ **Variants**: default, centered
- ✅ **Smooth Animations**: Scale-in and backdrop fade animations
- ✅ **Focus Management**: Automatic focus trap
- ✅ **ESC Key Support**: Close on Escape key (configurable)
- ✅ **Backdrop Click**: Close on backdrop click (configurable)
- ✅ **Close Button**: Optional close button with icon
- ✅ **Modular Sections**: Header, Body, Footer sub-components
- ✅ **Responsive Design**: Mobile-first with breakpoint adjustments
- ✅ **Theme Support**: Works with all color schemes
- ✅ **Uppercase Headers**: Professional text styling

## Basic Usage

```jsx
import { useState } from 'react'
import { Dialog } from '@/components/Dialog'
import { Button } from '@/components/Button'

function MyDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Header>
          <h2>Dialog Title</h2>
        </Dialog.Header>
        <Dialog.Body>
          Dialog content goes here
        </Dialog.Body>
        <Dialog.Footer>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Dialog.Footer>
      </Dialog>
    </>
  )
}
```

## API Reference

### Dialog (Container)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls dialog visibility |
| `onClose` | `function` | - | Called when dialog should close |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Dialog size |
| `variant` | `'default' \| 'centered'` | `'default'` | Dialog variant |
| `closeOnBackdropClick` | `boolean` | `true` | Close when clicking backdrop |
| `closeOnEscape` | `boolean` | `true` | Close when pressing ESC key |
| `showCloseButton` | `boolean` | `true` | Show close button in header |
| `className` | `string` | `''` | Additional CSS classes |

### Dialog Sub-components

- `Dialog.Header` - Dialog header with title
- `Dialog.Body` - Main scrollable content area
- `Dialog.Footer` - Action buttons and footer content

## Examples

### Simple Dialog

```jsx
function SimpleDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Header>
          <h2>Confirm Action</h2>
        </Dialog.Header>
        <Dialog.Body>
          Are you sure you want to proceed with this action?
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </Dialog.Footer>
      </Dialog>
    </>
  )
}
```

### Sizes

```jsx
{/* Small - 400px */}
<Dialog open={open} onClose={handleClose} size="sm">
  <Dialog.Body>Small dialog content</Dialog.Body>
</Dialog>

{/* Medium (default) - 560px */}
<Dialog open={open} onClose={handleClose} size="md">
  <Dialog.Body>Medium dialog content</Dialog.Body>
</Dialog>

{/* Large - 720px */}
<Dialog open={open} onClose={handleClose} size="lg">
  <Dialog.Body>Large dialog content</Dialog.Body>
</Dialog>

{/* Extra Large - 960px */}
<Dialog open={open} onClose={handleClose} size="xl">
  <Dialog.Body>Extra large dialog content</Dialog.Body>
</Dialog>

{/* Full Screen */}
<Dialog open={open} onClose={handleClose} size="full">
  <Dialog.Body>Full screen dialog</Dialog.Body>
</Dialog>
```

### Centered Variant

```jsx
<Dialog open={open} onClose={handleClose} variant="centered">
  <Dialog.Header>
    <h2>Centered Dialog</h2>
  </Dialog.Header>
  <Dialog.Body>
    This dialog has centered text alignment.
  </Dialog.Body>
  <Dialog.Footer>
    <Button onClick={handleClose}>Okay</Button>
  </Dialog.Footer>
</Dialog>
```

### Disable Close Options

```jsx
{/* Prevent closing on backdrop click */}
<Dialog
  open={open}
  onClose={handleClose}
  closeOnBackdropClick={false}
>
  <Dialog.Body>Click the button to close</Dialog.Body>
  <Dialog.Footer>
    <Button onClick={handleClose}>Close</Button>
  </Dialog.Footer>
</Dialog>

{/* Prevent closing on ESC key */}
<Dialog
  open={open}
  onClose={handleClose}
  closeOnEscape={false}
>
  <Dialog.Body>Must use button to close</Dialog.Body>
  <Dialog.Footer>
    <Button onClick={handleClose}>Close</Button>
  </Dialog.Footer>
</Dialog>

{/* Hide close button */}
<Dialog
  open={open}
  onClose={handleClose}
  showCloseButton={false}
>
  <Dialog.Body>No close button</Dialog.Body>
  <Dialog.Footer>
    <Button onClick={handleClose}>Close</Button>
  </Dialog.Footer>
</Dialog>
```

### Form Dialog

```jsx
function FormDialog() {
  const [open, setOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} size="md">
      <Dialog.Header>
        <h2>Add New Item</h2>
      </Dialog.Header>
      <Dialog.Body>
        <form id="item-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input id="name" type="text" required />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea id="description" rows="4"></textarea>
          </div>
        </form>
      </Dialog.Body>
      <Dialog.Footer>
        <Button variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" form="item-form">
          Save
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}
```

### Confirmation Dialog

```jsx
function DeleteConfirmation({ itemName, onConfirm }) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
      >
        <Dialog.Header>
          <h2>Confirm Deletion</h2>
        </Dialog.Header>
        <Dialog.Body>
          Are you sure you want to delete "{itemName}"?
          This action cannot be undone.
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Delete
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  )
}
```

### Long Content Dialog

```jsx
<Dialog open={open} onClose={handleClose} size="lg">
  <Dialog.Header>
    <h2>Terms and Conditions</h2>
  </Dialog.Header>
  <Dialog.Body>
    {/* Long scrollable content */}
    <p>Lorem ipsum dolor sit amet...</p>
    <p>Consectetur adipiscing elit...</p>
    {/* ... more content ... */}
  </Dialog.Body>
  <Dialog.Footer>
    <Button variant="outline" onClick={handleClose}>
      Decline
    </Button>
    <Button onClick={handleAccept}>
      Accept
    </Button>
  </Dialog.Footer>
</Dialog>
```

## Responsive Behavior

### Mobile (<768px)
- Full width with minimal margins
- All sizes become responsive (calc(100vw - spacing))
- Reduced padding for compact display
- Touch-friendly close button

### Tablet (768px - 1023px)
- XL dialogs become responsive
- Standard padding and spacing

### Desktop (≥1024px)
- Fixed widths for each size
- Optimal padding and spacing
- Full features enabled

## Size Reference

| Size | Mobile | Desktop |
|------|--------|---------|
| `sm` | Full width | 400px |
| `md` | Full width | 560px |
| `lg` | Full width | 720px |
| `xl` | Full width | 960px |
| `full` | Full viewport | Full viewport |

## Closing Behavior

The dialog can be closed in multiple ways:

1. **Close Button** - Click the X button in top-right (if `showCloseButton={true}`)
2. **ESC Key** - Press Escape (if `closeOnEscape={true}`)
3. **Backdrop Click** - Click outside the dialog (if `closeOnBackdropClick={true}`)
4. **Custom Trigger** - Call `onClose()` from any button or action

## Animations

- **Opening**: Scale-in animation with fade (from 95% to 100% scale)
- **Backdrop**: Fade-in with blur effect
- **Reduced Motion**: Animations disabled when `prefers-reduced-motion` is set

## Accessibility

- **Native Dialog**: Uses HTML `<dialog>` element for built-in accessibility
- **Focus Trap**: Focus is trapped within dialog when open
- **Keyboard Support**:
  - `ESC`: Close dialog (if enabled)
  - `Tab`: Navigate through focusable elements
- **ARIA**: Close button has `aria-label="Close dialog"`
- **Screen Readers**: Proper announcement of dialog state
- **Body Scroll Lock**: Body scroll prevented when dialog is open (native behavior)

## Styling

The Dialog component uses design system tokens:
- Background: `--color-surface`
- Borders: Subtle 1px with 30% opacity
- Shadow: `--shadow-2xl` for depth
- Backdrop: Semi-transparent with blur
- Transitions: Standard timing functions

### Custom Styling

```jsx
<Dialog className="custom-dialog" open={open} onClose={handleClose}>
  <Dialog.Header className="custom-header">
    <h2>Custom Styled Dialog</h2>
  </Dialog.Header>
  <Dialog.Body className="custom-body">
    Custom content
  </Dialog.Body>
  <Dialog.Footer className="custom-footer">
    <Button onClick={handleClose}>Close</Button>
  </Dialog.Footer>
</Dialog>
```

## Testing

Run tests:
```bash
npm test Dialog
```

33 comprehensive tests covering all functionality.

## Best Practices

1. **Always provide onClose**: Even if closing is restricted, provide a way to close
2. **Use appropriate size**: Choose size based on content amount
3. **Limit nesting**: Don't nest dialogs inside dialogs
4. **Focus management**: First focusable element gets focus automatically
5. **Loading states**: Show loading in dialog for async operations
6. **Validation**: Validate forms before closing
7. **Confirmation**: Use small dialogs for confirmations
8. **Mobile**: Test on mobile for usability

## Common Patterns

### Alert Dialog
```jsx
<Dialog size="sm" variant="centered">
  <Dialog.Body>Operation completed successfully!</Dialog.Body>
  <Dialog.Footer>
    <Button onClick={handleClose}>Okay</Button>
  </Dialog.Footer>
</Dialog>
```

### Multi-step Dialog
```jsx
<Dialog size="lg">
  <Dialog.Header>
    <h2>Step {step} of 3</h2>
  </Dialog.Header>
  <Dialog.Body>
    {step === 1 && <Step1 />}
    {step === 2 && <Step2 />}
    {step === 3 && <Step3 />}
  </Dialog.Body>
  <Dialog.Footer>
    {step > 1 && <Button onClick={handleBack}>Back</Button>}
    {step < 3 && <Button onClick={handleNext}>Next</Button>}
    {step === 3 && <Button onClick={handleFinish}>Finish</Button>}
  </Dialog.Footer>
</Dialog>
```

### Loading Dialog
```jsx
<Dialog
  size="sm"
  variant="centered"
  closeOnBackdropClick={false}
  closeOnEscape={false}
  showCloseButton={false}
>
  <Dialog.Body>
    <Spinner />
    <p>Processing...</p>
  </Dialog.Body>
</Dialog>
```

## Related Components

- **Button**: Use in Dialog.Footer for actions
- **Card**: For non-modal content containers
- **Accordion**: For collapsible content without overlays
