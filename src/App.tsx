import { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import HSEPolicies from './pages/HSEPolicies';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import Dubai from './pages/Dubai';
import Careers from './pages/Careers';
import Loader from './components/Loader';
import { WhatsAppButton } from './components/ui';
import { EMAILJS_CONFIG } from './components/ContactData';
import { AllData } from './types';

import { createContext, useContext } from 'react';

const AppDataContext = createContext<AllData | null>(null);

export const useAppData = (): AllData | null => {
  return useContext(AppDataContext);
};

// ─────────────────────────────────────────────────────────
//  Animated Routes
// ─────────────────────────────────────────────────────────
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        className="flex-1"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        <Routes location={location}>
          <Route path="/"         element={<Home />} />
          <Route path="/about"    element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery"  element={<Gallery />} />
          <Route path="/policies" element={<HSEPolicies />} />
          <Route path="/contact"  element={<Contact />} />
          <Route path="/dubai"    element={<Dubai />} />
          <Route path="/careers"  element={<Careers />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────
//  App Root
// ─────────────────────────────────────────────────────────
export default function App() {
  const [loaded,  setLoaded]  = useState(false);
  const [appData, setAppData] = useState<AllData | null>(null);

  // ── EmailJS init
  useEffect(() => {
    if (EMAILJS_CONFIG.PUBLIC_KEY) {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }
  }, []);

  // ── Stable callbacks passed to Loader
  const handleDataReady = useCallback((data: AllData) => {
    setAppData(data);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {/* Loader fetches all API data internally */}
      {!loaded && (
        <Loader
          onComplete={handleLoaderComplete}
          onDataReady={handleDataReady}
        />
      )}

      {/* App shell — only mounts after loader completes */}
      {loaded && (
        <AppDataContext.Provider value={appData}>
          <Router>
            <ScrollToTop />
            <WhatsAppButton />
            <div
              className="flex flex-col min-h-screen"
              style={{ background: '#080f1e' }}
            >
              <Header />
              <AnimatedRoutes />
              <Footer />
            </div>
          </Router>
        </AppDataContext.Provider>
      )}
    </>
  );
}