import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ReviewDetail } from './pages/ReviewDetail';
import { LegalNotice } from './pages/LegalNotice';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/viaje/:id" element={<ReviewDetail />} />
        <Route path="/aviso-legal" element={<LegalNotice />} />
      </Routes>
    </Router>
  );
}
