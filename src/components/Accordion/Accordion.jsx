import { createContext, useContext, useMemo, useState } from 'react'
import { MdExpandMore } from 'react-icons/md'
import './Accordion.css'

const AccordionContext = createContext(null)

export function Accordion({
  children,
  variant = 'default',
  rounded = true,
  allowMultiple = false,
  defaultOpenItems = [],
  className = '',
  ...props
}) {
  const [openItems, setOpenItems] = useState(new Set(defaultOpenItems))

  const toggleItem = (id) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        return next
      }
      if (!allowMultiple) {
        next.clear()
      }
      next.add(id)
      return next
    })
  }

  const value = useMemo(
    () => ({ openItems, toggleItem }),
    [openItems]
  )

  const classes = [
    'accordion',
    `accordion--${variant}`,
    rounded ? 'accordion--rounded' : 'accordion--square',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <AccordionContext.Provider value={value}>
      <div className={classes} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

Accordion.Item = function AccordionItem({ id, children, className = '', ...props }) {
  const classes = ['accordion__item', className].filter(Boolean).join(' ')
  return (
    <div className={classes} data-accordion-id={id} {...props}>
      {children}
    </div>
  )
}

Accordion.Header = function AccordionHeader({
  itemId,
  children,
  className = '',
  ...props
}) {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion.Header must be used within Accordion')
  }
  const isOpen = context.openItems.has(itemId)
  const classes = ['accordion__header', className].filter(Boolean).join(' ')

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      context.toggleItem(itemId)
    }
  }

  return (
    <button
      type="button"
      className={classes}
      aria-expanded={isOpen}
      aria-controls={`accordion-panel-${itemId}`}
      onClick={() => context.toggleItem(itemId)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <span className="accordion__title">{children}</span>
      <MdExpandMore
        className={[
          'accordion__icon',
          isOpen && 'accordion__icon--open',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
      />
    </button>
  )
}

Accordion.Content = function AccordionContent({
  itemId,
  children,
  className = '',
  ...props
}) {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion.Content must be used within Accordion')
  }
  const isOpen = context.openItems.has(itemId)
  const classes = [
    'accordion__content',
    isOpen && 'accordion__content--open',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      id={`accordion-panel-${itemId}`}
      className={classes}
      role="region"
      aria-hidden={!isOpen}
      {...props}
    >
      <div className="accordion__content-inner">{children}</div>
    </div>
  )
}

export default Accordion
