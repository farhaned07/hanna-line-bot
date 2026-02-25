import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Login from './pages/Login'
import DashboardHome from './pages/DashboardHome'
import DashboardLayout from './components/DashboardLayout'
import ErrorBoundary from './components/ErrorBoundary'
import { supabase } from './lib/supabase'
import './styles/tokens.css'

import Patients from './pages/Patients'
import PatientDetail from './pages/PatientDetail'
import MonitoringView from './pages/MonitoringView'
import Staff from './pages/Staff'
import Analytics from './pages/Analytics'

function App() {
  // Use a function to initialize state to ensure fresh localStorage read
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem('nurse_token')
    return token ? { user: { email: localStorage.getItem('user_email') || 'staff@hanna' } } : null
  })

  useEffect(() => {
    // Listen for storage changes (e.g., after login)
    const handleStorageChange = () => {
      const token = localStorage.getItem('nurse_token')
      if (token) {
        setSession({ user: { email: localStorage.getItem('user_email') || 'staff@hanna' } })
      } else {
        setSession(null)
      }
    }

    // Listen for custom login event (for same-tab updates)
    window.addEventListener('storage', handleStorageChange)

    // Also check on mount
    handleStorageChange()

    // Supabase auth state (Legacy fallback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, supabaseSession) => {
      if (supabaseSession) {
        setSession(supabaseSession)
      } else if (!localStorage.getItem('nurse_token')) {
        setSession(null)
      }
    })

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      subscription.unsubscribe()
    }
  }, [])

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={session ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={session ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route index element={<DashboardHome />} />
          <Route path="monitoring" element={<MonitoringView />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:id" element={<PatientDetail />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="staff" element={<Staff />} />

        </Route>
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App

