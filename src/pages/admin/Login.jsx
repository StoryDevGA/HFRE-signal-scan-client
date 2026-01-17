import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button.jsx'
import Fieldset from '../../components/Fieldset/Fieldset.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import Header from '../../components/Header/Header.jsx'
import Input from '../../components/Input/Input.jsx'
import { useToaster } from '../../components/Toaster/Toaster.jsx'
import { loginAdmin } from '../../services/adminAuth.js'

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
      sessionStorage.setItem('adminEmail', values.email.trim())
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
      <Header logo="StorylineOS" logoLink="/" showNavigation={false} />
      <main className="page container">
        <header className="page__header">
          <h1 className="text-responsive-xl">Admin Login</h1>
          <p className="text-responsive-base">
            Use your approved email and the shared password.
          </p>
        </header>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <Fieldset>
            <Fieldset.Legend>Credentials</Fieldset.Legend>
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
            </Fieldset.Content>
          </Fieldset>

          <Button type="submit" loading={isSubmitting} fullWidth>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </main>
      <Footer copyright="StorylineOS" />
    </>
  )
}

export default AdminLogin
