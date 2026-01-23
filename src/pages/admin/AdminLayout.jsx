import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button.jsx'
import Dialog from '../../components/Dialog/Dialog.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import Fieldset from '../../components/Fieldset/Fieldset.jsx'
import Header from '../../components/Header/Header.jsx'
import Spinner from '../../components/Spinner/Spinner.jsx'
import TabView from '../../components/TabView/TabView.jsx'
import { useToaster } from '../../components/Toaster/Toaster.jsx'
import { checkAdminSession, logoutAdmin } from '../../services/adminAuth.js'
import { getAdminPrompts } from '../../services/adminPrompts.js'
import storylineLogo from '../../assets/images/storylineOS-Logo.png'

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addToast } = useToaster()
  const [status, setStatus] = useState('checking')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isCheckingPrompts, setIsCheckingPrompts] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [logoutWarning, setLogoutWarning] = useState('')

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

  const adminTabs = useMemo(
    () => [
      { label: 'Submissions', path: '/admin/submissions' },
      { label: 'Prompts', path: '/admin/prompts' },
      { label: 'Users', path: '/admin/users' },
      { label: 'Analytics', path: '/admin/analytics' },
    ],
    []
  )

  const activeTabIndex = useMemo(() => {
    const matchIndex = adminTabs.findIndex((tab) =>
      location.pathname.startsWith(tab.path)
    )
    return matchIndex === -1 ? 0 : matchIndex
  }, [adminTabs, location.pathname])

  const handleLogoutRequest = async () => {
    if (isLoggingOut || isCheckingPrompts) return
    setIsCheckingPrompts(true)
    try {
      const response = await getAdminPrompts()
      const prompts = Array.isArray(response)
        ? response
        : Array.isArray(response?.items)
          ? response.items
          : []
      const systemActive = prompts.some(
        (prompt) => prompt.type === 'system' && (prompt.isPublished || prompt.isActive)
      )
      const userActive = prompts.some(
        (prompt) => prompt.type === 'user' && (prompt.isPublished || prompt.isActive)
      )

      if (!systemActive || !userActive) {
        setLogoutWarning(
          'One or more prompts are inactive. Scans will fail until both system and user prompts are active.'
        )
        setShowLogoutConfirm(true)
        return
      }
    } catch (error) {
      addToast({
        title: 'Prompt status unavailable',
        description: error?.message || 'Unable to verify prompt status.',
        variant: 'warning',
      })
    } finally {
      setIsCheckingPrompts(false)
    }

    handleLogout()
  }

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
    <>
      <Header
        logo={
          <img src={storylineLogo} alt="StorylineOS" className="home__brand-logo" />
        }
        logoLink="/"
        showNavigation={false}
      />
      <main className="page container">
        <Fieldset>
          <Fieldset.Legend>
            <span className="home__legend">
              <span>admin</span>
            </span>
          </Fieldset.Legend>
          <Fieldset.Content>
            <div className="admin-tabs__header">
              <Button
                variant="secondary"
                size="xs"
                onClick={handleLogoutRequest}
                loading={isLoggingOut || isCheckingPrompts}
              >
                {isLoggingOut ? 'Signing out...' : 'Sign out'}
              </Button>
            </div>
            <TabView
              key={location.pathname}
              defaultActiveTab={activeTabIndex}
              onTabChange={(index) => {
                navigate(adminTabs[index]?.path || '/admin/submissions')
              }}
              className="admin-tabs"
            >
              {adminTabs.map((tab) => (
                <TabView.Tab key={tab.path} label={tab.label} />
              ))}
            </TabView>
            <div className="admin-tabs__content">
              <Outlet />
            </div>
          </Fieldset.Content>
        </Fieldset>
        <Footer copyright="StorylineOS" />
      </main>

      <Dialog open={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} size="sm">
        <Dialog.Header>
          <h2>Prompt inactive</h2>
        </Dialog.Header>
        <Dialog.Body>
          <p>{logoutWarning}</p>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutConfirm(false)} size="xs">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout} loading={isLoggingOut} size="xs">
            {isLoggingOut ? 'Signing out...' : 'Sign out'}
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  )
}

export default AdminLayout
