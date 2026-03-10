import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from '@/hooks/useToast';
import { Toaster } from '@/components/ui/Toaster';

// Pages
import Home from '@/pages/Home';
import Record from '@/pages/Record';
import Processing from '@/pages/Processing';
import NoteEditor from '@/pages/NoteEditor';
import Settings from '@/pages/Settings';
import Handover from '@/pages/Handover';
import CarePlan from '@/pages/CarePlan';

function App() {
    return (
        <ToastProvider>
            <BrowserRouter>
                <Routes>
                    {/* Main Routes - Mobile First */}
                    <Route path="/" element={<Home />} />
                    <Route path="/record/:sessionId" element={<Record />} />
                    <Route path="/processing/:sessionId" element={<Processing />} />
                    <Route path="/note/:noteId" element={<NoteEditor />} />
                    <Route path="/careplan" element={<CarePlan />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/handover" element={<Handover />} />

                    {/* Redirects */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
            <Toaster />
        </ToastProvider>
    );
}

export default App;
