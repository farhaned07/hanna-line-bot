import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScribeLanding from './components/ScribeLanding';
import Terms from './components/Terms';
import Privacy from './components/Privacy';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* New Hanna Landing Page */}
        <Route path="/" element={<ScribeLanding />} />

        {/* Legal */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </Router>
  );
};

export default App;