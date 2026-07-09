/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import RoomsPage from './pages/Rooms';
import RooftopPage from './pages/Rooftop';
import ContactPage from './pages/Contact';
import GalleryPage from './pages/Gallery';
import Booking from './pages/Booking';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Cancellation from './pages/Cancellation';
import AdminLogin from './pages/AdminLogin';
import AdminConsole from './pages/AdminConsole';
import AdminCMS from './pages/AdminCMS';
import AdminLeads from './pages/AdminLeads';
import { getToken } from './lib/api';

function RequireAuth({ children }: { children: ReactNode }) {
  return getToken() ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

function Layout() {
  const isAdmin = useLocation().pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/rooftop" element={<RooftopPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cancellation" element={<Cancellation />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<RequireAuth><AdminConsole /></RequireAuth>} />
        <Route path="/admin/cms" element={<RequireAuth><AdminCMS /></RequireAuth>} />
        <Route path="/admin/leads" element={<RequireAuth><AdminLeads /></RequireAuth>} />
      </Routes>
      {!isAdmin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
