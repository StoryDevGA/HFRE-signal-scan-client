import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button.jsx'
import Fieldset from '../../components/Fieldset/Fieldset.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import Header from '../../components/Header/Header.jsx'
import Input from '../../components/Input/Input.jsx'
import Link from '../../components/Link/Link.jsx'
import Pill from '../../components/Pill/Pill.jsx'
import { useToaster } from '../../components/Toaster/Toaster.jsx'
import { loginAdmin } from '../../services/adminAuth.js'
import storylineLogo from '../../assets/images/storylineOS-Logo.png'
import { MdArrowBack } from 'react-icons/md'

function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addToast } = useToaster()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onBlur' })

  const onSubmit = async (values) => {
    try {
      await loginAdmin(values)
      const destination = location.state?.from || '/admin/submissions'
      navigate(destination, { replace: true })
    } catch (error) {
      addToast({
        title: 'Login failed',
        description: error?.message || 'Check your credentials and try again.',
        variant: 'error',
      })
    }
  }

  return (
    <>
      <Header
        logo={
          <img src={storylineLogo} alt="StorylineOS" className="home__brand-logo" />
        }
        logoLink="/"
        showNavigation={false}
      />
      <main className="page container">
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
          <h1 className="text-responsive-xl text-uppercase">admin login</h1>
          <p className="text-responsive-base">
            Use your approved email and the shared password.
          </p>
          <div className="home__benefits">
            <Pill size="sm">Restricted</Pill>
            <Pill size="sm">Secure</Pill>
            <Pill size="sm">Internal</Pill>
          </div>
          <p className="text-responsive-sm text-tertiary">
            Access is limited to approved admin accounts.
          </p>
        </header>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <Fieldset>
            <Fieldset.Legend>
              <span className="home__legend">
                <span>Credentials</span>
              </span>
            </Fieldset.Legend>
            <Fieldset.Content>
              <Input
                id="admin_email"
                type="email"
                label="Email"
                error={errors.email?.message}
                required
                fullWidth
                {...register('email', { required: 'Email is required.' })}
              />

              <Input
                id="admin_password"
                type="password"
                label="Password"
                error={errors.password?.message}
                required
                fullWidth
                {...register('password', { required: 'Password is required.' })}
              />

              <Button type="submit" loading={isSubmitting} fullWidth size="xs">
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </Fieldset.Content>
          </Fieldset>
        </form>
      </main>
      <Footer copyright="StorylineOS" />
    </>
  )
}

export default AdminLogin
