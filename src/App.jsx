import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Results from './pages/Results.jsx'
import AdminLogin from './pages/admin/Login.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminSubmissions from './pages/admin/Submissions.jsx'
import AdminSubmissionDetail from './pages/admin/SubmissionDetail.jsx'
import AdminPrompts from './pages/admin/Prompts.jsx'
import AdminUsers from './pages/admin/Users.jsx'
import AdminAnalytics from './pages/admin/insights/index.js'

function NotFound() {
  return (
    <main className="page">
      <h1>Page not found</h1>
      <p>Check the URL and try again.</p>
    </main>
  )
}

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results/:publicId" element={<Results />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/submissions" replace />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="submissions/:id" element={<AdminSubmissionDetail />} />
          <Route path="prompts" element={<AdminPrompts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
