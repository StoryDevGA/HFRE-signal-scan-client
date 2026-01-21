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
  const appVersion = import.meta.env.VITE_APP_VERSION
  const appBuild = import.meta.env.VITE_APP_BUILD
  const buildLabel = appBuild ? `+${appBuild}` : ''
  const versionLabel = appVersion
    ? `v${appVersion}${buildLabel}`
    : appBuild
      ? `build ${appBuild}`
      : ''

  return (
    <footer className={footerClasses} {...props}>
      {sections.length > 0 ? (
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
      ) : null}
      <div className="footer__meta">
        <DateTime className="footer__datetime" />
        {copyright ? (
          <p className="footer__copyright">
            {showYear ? `${year} ` : ''}
            {copyright}
            {versionLabel ? ` ${versionLabel}` : ''}
          </p>
        ) : null}
      </div>
    </footer>
  )
}

export default Footer
