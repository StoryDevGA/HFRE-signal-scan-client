import { useNavigate } from 'react-router-dom'
import Button from '../components/Button/Button.jsx'
import Card from '../components/Card/Card.jsx'
import Fieldset from '../components/Fieldset/Fieldset.jsx'
import Footer from '../components/Footer/Footer.jsx'
import Header from '../components/Header/Header.jsx'
import PublicPageHeader from '../components/PublicPageHeader/PublicPageHeader.jsx'
import storylineLogo from '../assets/images/storylineOS-Logo.png'

function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <Header
        logo={<img src={storylineLogo} alt="StorylineOS" className="home__brand-logo" />}
        logoLink="/"
        showNavigation={false}
      />

      <main className="page container">
        <PublicPageHeader />

        <Fieldset>
          <Fieldset.Legend>
            <span className="home__legend">
              <span>Page not found</span>
            </span>
          </Fieldset.Legend>
          <Fieldset.Content>
            <Card className="detail-card">
              <p className="text-responsive-base text-secondary">
                Sorry, this page is not available. It may have moved or the link may be out of date.
              </p>
              <Button onClick={() => navigate('/')} fullWidth>
                Go to Home Page
              </Button>
            </Card>
          </Fieldset.Content>
        </Fieldset>
      </main>

      <Footer copyright="StorylineOS" />
    </>
  )
}

export default NotFound
