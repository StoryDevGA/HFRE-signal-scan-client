import { DateTime } from '../DateTime/DateTime.jsx'
import Link from '../Link/Link.jsx'
import './Footer.css'

export function Footer({
  sections = [],
  copyright,
  showYear = true,
  className = '',
  ...props
}) {
  const year = new Date().getFullYear()
  const footerClasses = ['footer', className].filter(Boolean).join(' ')

  return (
    <footer className={footerClasses} {...props}>
      <div className="footer__sections">
        {sections.map((section, index) => (
          <div key={`${section.title || 'section'}-${index}`} className="footer__section">
            {section.title ? (
              <h3 className="footer__title">{section.title}</h3>
            ) : null}
            {section.content ? (
              <div className="footer__content">{section.content}</div>
            ) : null}
            {section.links ? (
              <ul className="footer__links">
                {section.links.map((link) => (
                  <li key={`${link.label}-${link.to || link.href}`} className="footer__item">
                    <Link
                      to={link.to}
                      href={link.href}
                      external={link.external}
                      openInNewTab={link.openInNewTab}
                      variant="secondary"
                      underline="hover"
                      className="footer__link"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
      <div className="footer__meta">
        <DateTime className="footer__datetime" />
        {copyright ? (
          <p className="footer__copyright">
            {showYear ? `${year} ` : ''}
            {copyright}
          </p>
        ) : null}
      </div>
    </footer>
  )
}

export default Footer
