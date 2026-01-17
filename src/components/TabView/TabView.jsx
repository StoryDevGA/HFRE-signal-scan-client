import { Children, useMemo, useRef, useState } from 'react'
import './TabView.css'

export function TabView({
  children,
  defaultActiveTab = 0,
  variant = 'default',
  orientation = 'horizontal',
  onTabChange,
  className = '',
  ...props
}) {
  const tabs = useMemo(() => Children.toArray(children), [children])
  const [activeIndex, setActiveIndex] = useState(defaultActiveTab)
  const tabRefs = useRef([])

  const handleSelect = (index) => {
    setActiveIndex(index)
    onTabChange?.(index)
  }

  const handleKeyDown = (event) => {
    const count = tabs.length
    if (!count) return
    const isVertical = orientation === 'vertical'
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight'
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft'

    if (event.key === nextKey) {
      event.preventDefault()
      const next = (activeIndex + 1) % count
      handleSelect(next)
      tabRefs.current[next]?.focus()
    }
    if (event.key === prevKey) {
      event.preventDefault()
      const prev = (activeIndex - 1 + count) % count
      handleSelect(prev)
      tabRefs.current[prev]?.focus()
    }
    if (event.key === 'Home') {
      event.preventDefault()
      handleSelect(0)
      tabRefs.current[0]?.focus()
    }
    if (event.key === 'End') {
      event.preventDefault()
      handleSelect(count - 1)
      tabRefs.current[count - 1]?.focus()
    }
  }

  const classes = [
    'tabview',
    `tabview--${variant}`,
    `tabview--${orientation}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...props}>
      <div
        className="tabview__list"
        role="tablist"
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex
          const id = `tab-${index}`
          const panelId = `panel-${index}`
          return (
            <button
              key={id}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              id={id}
              className={['tabview__tab', isActive && 'tabview__tab--active']
                .filter(Boolean)
                .join(' ')}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSelect(index)}
            >
              {tab.props.label}
            </button>
          )
        })}
      </div>
      <div className="tabview__panels">
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex
          const id = `panel-${index}`
          return (
            <div
              key={id}
              id={id}
              className="tabview__panel"
              role="tabpanel"
              aria-labelledby={`tab-${index}`}
              hidden={!isActive}
            >
              {tab.props.children}
            </div>
          )
        })}
      </div>
    </div>
  )
}

TabView.Tab = function Tab({ children }) {
  return children
}

export default TabView
