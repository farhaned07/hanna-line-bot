import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/Toaster'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { NewSession } from './pages/NewSession'
import { Recording } from './pages/Recording'
import { Processing } from './pages/Processing'
import { NoteView } from './pages/NoteView'
import { NoteEditor } from './pages/NoteEditor'
import { Handover } from './pages/Handover'
import { Settings } from './pages/Settings'
import { NotesList } from './pages/NotesList'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" />
          <p className="text-[hsl(var(--muted-foreground))] text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))]">
        <div className="w-10 h-10 border-2 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/new"
        element={
          <ProtectedRoute>
            <NewSession />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recording/:sessionId"
        element={
          <ProtectedRoute>
            <Recording />
          </ProtectedRoute>
        }
      />
      <Route
        path="/processing/:sessionId"
        element={
          <ProtectedRoute>
            <Processing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <NotesList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes/:noteId"
        element={
          <ProtectedRoute>
            <NoteView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes/:noteId/edit"
        element={
          <ProtectedRoute>
            <NoteEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/handover"
        element={
          <ProtectedRoute>
            <Handover />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster>
          <div className="min-h-screen bg-[hsl(var(--background))]">
            <AppRoutes />
          </div>
        </Toaster>
      </AuthProvider>
    </BrowserRouter>
  )
}
