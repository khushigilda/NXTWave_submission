import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { captureSourceParams, trackEvent } from './analytics';
import LandingPage from './pages/LandingPage';
import ChallengePage from './pages/ChallengePage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  useEffect(() => {
    captureSourceParams();
    trackEvent('landing_page_view');
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/challenge" element={<ChallengePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
