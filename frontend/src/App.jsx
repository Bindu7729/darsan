import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import TempleDetails from './pages/TempleDetails';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import OrganizerDash from './pages/OrganizerDash';
import Auth from './pages/Auth';
import AdminDash from './pages/AdminDash';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-brand-bgBase">
        {/* Global Navigation Header Component */}
        <Navbar />
        
        {/* Main Application Routing Configuration */}
        <main className="flex-grow">
          <Routes>
            {/* 1. PUBLIC VISITOR LANDINGS */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/temple/:id" element={<TempleDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* 2. PROTECTED DEVOTEE FLOWS */}
            <Route 
              path="/booking" 
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            {/* 3. RESTRICTED GATE OPERATIONS PORTAL */}
            <Route 
              path="/organizer" 
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <OrganizerDash />
                </ProtectedRoute>
              } 
            />
            
            {/* 4. SUPERUSER ADMINISTRATION SYSTEM */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDash />
                </ProtectedRoute>
              } 
            />

            {/* 5. 404 NOT FOUND FALLBACK */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}