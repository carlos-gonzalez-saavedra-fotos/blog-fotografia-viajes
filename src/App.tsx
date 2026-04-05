import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { ReviewDetail } from './pages/ReviewDetail';
import { LegalNotice } from './pages/LegalNotice';
import { Navbar } from './components/Navbar';

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorar" element={<Explore />} />
          <Route path="/viaje/:id" element={<ReviewDetail />} />
          <Route path="/aviso-legal" element={<LegalNotice />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}
