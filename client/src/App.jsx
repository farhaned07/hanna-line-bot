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
import Payments from './pages/Payments'
import MonitoringView from './pages/MonitoringView'
import AgentCommand from './pages/AgentCommand'
import Analytics from './pages/Analytics'

function App() {
  // MOCK SESSION FOR UX AUDIT - Remove in production
  const [session, setSession] = useState({
    user: { email: 'admin@hanna.demo' }
  })

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session)
  //   })

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session)
  //   })

  //   return () => subscription.unsubscribe()
  // }, [])

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={session ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={session ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route index element={<DashboardHome />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="monitoring" element={<MonitoringView />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:id" element={<PatientDetail />} />
          <Route path="payments" element={<Payments />} />
          <Route path="agents" element={<AgentCommand />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App

