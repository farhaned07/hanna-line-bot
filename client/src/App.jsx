import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Login from './pages/Login'
import DashboardHome from './pages/DashboardHome'
import DashboardLayout from './components/DashboardLayout'
import { supabase } from './lib/supabase'

import Patients from './pages/Patients'
import Payments from './pages/Payments'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={session ? <DashboardLayout /> : <Navigate to="/login" />}>
        <Route index element={<DashboardHome />} />
        <Route path="patients" element={<Patients />} />
        <Route path="payments" element={<Payments />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App
