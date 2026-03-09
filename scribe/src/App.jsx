import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast.jsx';

// Pages
import Home from './pages/Home';
import Record from './pages/Record';
import Processing from './pages/Processing';
import NoteEditor from './pages/NoteEditor';
import Settings from './pages/Settings';
import Handover from './pages/Handover';

function App() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <Routes>
                    {/* Main Routes */}
                    <Route path="/scribe/app" element={<Home />} />
                    <Route path="/scribe/app/record/:sessionId" element={<Record />} />
                    <Route path="/scribe/app/processing/:sessionId" element={<Processing />} />
                    <Route path="/scribe/app/note/:noteId" element={<NoteEditor />} />
                    <Route path="/scribe/app/settings" element={<Settings />} />
                    <Route path="/scribe/app/handover" element={<Handover />} />

                    {/* Redirects */}
                    <Route path="/" element={<Navigate to="/scribe/app" replace />} />
                    <Route path="*" element={<Navigate to="/scribe/app" replace />} />
                </Routes>
            </ToastProvider>
        </BrowserRouter>
    );
}

export default App;
