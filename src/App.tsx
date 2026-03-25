import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ReviewDetail } from './pages/ReviewDetail';
import { LegalNotice } from './pages/LegalNotice';
import { Navbar } from './components/Navbar';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/viaje/:id" element={<ReviewDetail />} />
        <Route path="/aviso-legal" element={<LegalNotice />} />
      </Routes>
    </Router>
  );
}
