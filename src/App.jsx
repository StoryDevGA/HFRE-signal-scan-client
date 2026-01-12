import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Results from './pages/Results.jsx'
import AdminLogin from './pages/admin/Login.jsx'

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
