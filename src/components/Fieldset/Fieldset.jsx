/**
 * Fieldset Component
 *
 * Professional fieldset component built on native HTML <fieldset> element
 * with legend that breaks the border and flex content layout.
 */

import './Fieldset.css'

/**
 * Main Fieldset Component
 */
export function Fieldset({
  children,
  variant = 'default',
  disabled = false,
  gap = 'md',
  className = '',
  ...props
}) {
  const fieldsetClasses = [
    'fieldset',
    `fieldset--${variant}`,
    `fieldset--gap-${gap}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <fieldset className={fieldsetClasses} disabled={disabled} {...props}>
      {children}
    </fieldset>
  )
}

/**
 * Fieldset Legend
 */
Fieldset.Legend = function FieldsetLegend({ children, className = '', ...props }) {
  const legendClasses = ['fieldset__legend', className].filter(Boolean).join(' ')

  return (
    <legend className={legendClasses} {...props}>
      {children}
    </legend>
  )
}

/**
 * Fieldset Content (Flex Container)
 */
Fieldset.Content = function FieldsetContent({ children, className = '', ...props }) {
  const contentClasses = ['fieldset__content', className].filter(Boolean).join(' ')

  return (
    <div className={contentClasses} {...props}>
      {children}
    </div>
  )
}

export default Fieldset
