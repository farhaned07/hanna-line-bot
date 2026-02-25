import { Routes, Route, Navigate } from 'react-router-dom'
import AuthGuard from './components/AuthGuard'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Record from './pages/Record'
import Processing from './pages/Processing'
import NoteView from './pages/NoteView'
import NoteEditor from './pages/NoteEditor'
import Handover from './pages/Handover'
import Settings from './pages/Settings'

export default function App() {
    return (
        <div className="min-h-dvh bg-bg">
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/onboarding" element={<Onboarding />} />

                {/* Protected routes */}
                <Route path="/" element={<AuthGuard><Home /></AuthGuard>} />
                <Route path="/record/:sessionId" element={<AuthGuard><Record /></AuthGuard>} />
                <Route path="/processing/:sessionId" element={<AuthGuard><Processing /></AuthGuard>} />
                <Route path="/note/:noteId" element={<AuthGuard><NoteView /></AuthGuard>} />
                <Route path="/note/:noteId/edit" element={<AuthGuard><NoteEditor /></AuthGuard>} />
                <Route path="/handover" element={<AuthGuard><Handover /></AuthGuard>} />
                <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}
