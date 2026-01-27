import Link from '../Link/Link.jsx'
import Pill from '../Pill/Pill.jsx'
import { MdArrowBack } from 'react-icons/md'

export function PublicPageHeader() {
  return (
    <header className="page__header">
      <Pill
        as={Link}
        href="https://www.storylineos.com/"
        openInNewTab
        className="home__back-link"
        variant="neutral"
        size="md"
        leftIcon={<MdArrowBack />}
      >
        Back to StorylineOS
      </Pill>
      <h1 className="text-responsive-xl text-uppercase">Customer-safe signal scan</h1>
      <p className="text-responsive-base">
        Get a shareable scan of your company's public signals in minutes.
      </p>
      <div className="home__benefits">
        <Pill size="sm">Instant results</Pill>
        <Pill size="sm">Confidential</Pill>
        <Pill size="sm">Free</Pill>
      </div>
      <p className="text-responsive-sm text-tertiary">
        We only scan public information and never share your data.
      </p>
    </header>
  )
}

export default PublicPageHeader
