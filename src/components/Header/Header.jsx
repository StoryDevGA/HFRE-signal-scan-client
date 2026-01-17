import { useId, useState } from 'react'
import Link from '../Link/Link.jsx'
import './Header.css'

export function Header({
  logo = 'App',
  logoLink = '/',
  showNavigation = true,
  sticky = true,
  navigation,
  className = '',
  children,
  ...props
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navId = useId()
  const headerClasses = [
    'header',
    sticky && 'header--sticky',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const handleToggle = () => setMenuOpen((prev) => !prev)
  const handleClose = () => setMenuOpen(false)

  return (
    <header className={headerClasses} {...props}>
      <div className="header__inner">
        <div className="header__logo">
          {logoLink ? (
            <Link to={logoLink} underline="none" onClick={handleClose}>
              {logo}
            </Link>
          ) : (
            <span className="header__logo-text">{logo}</span>
          )}
        </div>
        {showNavigation ? (
          <>
            <button
              type="button"
              className="header__hamburger"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
              aria-controls={navId}
              onClick={handleToggle}
            >
              <span className="header__hamburger-line" />
              <span className="header__hamburger-line" />
              <span className="header__hamburger-line" />
            </button>
            <nav
              id={navId}
              className={[
                'header__nav',
                menuOpen && 'header__nav--open',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {navigation}
            </nav>
          </>
        ) : null}
        {children ? <div className="header__actions">{children}</div> : null}
      </div>
    </header>
  )
}

export default Header
