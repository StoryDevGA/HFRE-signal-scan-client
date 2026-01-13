import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Results from './pages/Results.jsx'
import AdminLogin from './pages/admin/Login.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminSubmissions from './pages/admin/Submissions.jsx'

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
          <Route path="prompts" element={<div className="page">Prompts</div>} />
          <Route path="users" element={<div className="page">Users</div>} />
          <Route path="analytics" element={<div className="page">Analytics</div>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
