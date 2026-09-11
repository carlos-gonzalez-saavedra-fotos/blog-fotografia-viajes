import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Home } from './pages/Home';
import { Navbar } from './components/Navbar';
import { ChronicleSkeleton } from './components/ui/LoadingSkeleton';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

const Explore = lazy(() => import('./pages/Explore').then(m => ({ default: m.Explore })));
const ReviewDetail = lazy(() => import('./pages/ReviewDetail').then(m => ({ default: m.ReviewDetail })));
const LegalNotice = lazy(() => import('./pages/LegalNotice').then(m => ({ default: m.LegalNotice })));

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <Navbar />
        <ErrorBoundary>
          <Suspense fallback={<ChronicleSkeleton />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explorar" element={<Explore />} />
              <Route path="/viaje/:id" element={<ReviewDetail />} />
              <Route path="/aviso-legal" element={<LegalNotice />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Router>
    </HelmetProvider>
  );
}
