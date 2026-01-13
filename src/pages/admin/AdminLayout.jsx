import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button.jsx'
import Spinner from '../../components/Spinner/Spinner.jsx'
import { useToaster } from '../../components/Toaster/Toaster.jsx'
import { checkAdminSession, logoutAdmin } from '../../services/adminAuth.js'

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addToast } = useToaster()
  const [status, setStatus] = useState('checking')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    let isActive = true
    setStatus('checking')
    setErrorMessage('')

    checkAdminSession()
      .then((ok) => {
        if (!isActive) return
        if (!ok) {
          navigate('/admin/login', {
            replace: true,
            state: { from: location.pathname },
          })
          return
        }
        setStatus('ready')
      })
      .catch((error) => {
        if (!isActive) return
        setErrorMessage(error?.message || 'Unable to verify admin session.')
        setStatus('error')
      })

    return () => {
      isActive = false
    }
  }, [location.pathname, navigate])

  if (status === 'checking') {
    return (
      <main className="page container">
        <div className="status-block">
          <Spinner type="circle" size="lg" />
          <p className="text-responsive-base">Checking admin access...</p>
        </div>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="page container">
        <header className="page__header">
          <h1 className="text-responsive-xl">Admin unavailable</h1>
          <p className="text-responsive-base">{errorMessage}</p>
        </header>
      </main>
    )
  }

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logoutAdmin()
      addToast({
        title: 'Signed out',
        description: 'You have been logged out.',
        variant: 'info',
      })
      navigate('/admin/login', { replace: true })
    } catch (error) {
      addToast({
        title: 'Logout failed',
        description: error?.message || 'Unable to log out right now.',
        variant: 'error',
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="admin">
      <aside className="admin__nav">
        <h2 className="admin__title">Admin</h2>
        <nav className="admin__links">
          <NavLink
            to="/admin/submissions"
            className={({ isActive }) =>
              ['admin__link', isActive ? 'admin__link--active' : '']
                .filter(Boolean)
                .join(' ')
            }
          >
            Submissions
          </NavLink>
          <NavLink
            to="/admin/prompts"
            className={({ isActive }) =>
              ['admin__link', isActive ? 'admin__link--active' : '']
                .filter(Boolean)
                .join(' ')
            }
          >
            Prompts
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              ['admin__link', isActive ? 'admin__link--active' : '']
                .filter(Boolean)
                .join(' ')
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              ['admin__link', isActive ? 'admin__link--active' : '']
                .filter(Boolean)
                .join(' ')
            }
          >
            Analytics
          </NavLink>
        </nav>
        <div className="admin__actions">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            loading={isLoggingOut}
          >
            {isLoggingOut ? 'Signing out...' : 'Sign out'}
          </Button>
        </div>
      </aside>
      <main className="admin__content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
