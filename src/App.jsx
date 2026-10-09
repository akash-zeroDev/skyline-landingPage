import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/hero/HeroSection';
import WhatWeDo from './components/whatWeDo/WhatWeDo';
import WorkSection from './components/sections/WorkSection';
import ContactPage from './components/contact/ContactPage';
import Footer from './components/footer/Footer';
import './App.css';

function App() {
  const getInitialRoute = () => {
    if (typeof window === 'undefined') return '/';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('/contact') || hash === '#contact') return '/contact';
    return '/';
  };

  const [route, setRoute] = useState(getInitialRoute);

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/contact') || hash === '#contact') {
        setRoute('/contact');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setRoute('/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (newRoute, targetHash = '') => {
    if (newRoute === '/contact') {
      window.history.pushState({}, '', '/contact');
      setRoute('/contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const url = targetHash ? `/${targetHash}` : '/';
      window.history.pushState({}, '', url);
      setRoute('/');
      if (targetHash) {
        setTimeout(() => {
          const el = document.querySelector(targetHash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="skyline-app">
      <Navbar
        currentRoute={route}
        onNavigateHome={() => navigateTo('/')}
        onNavigateContact={() => navigateTo('/contact')}
        onNavigateSection={(hash) => navigateTo('/', hash)}
      />

      {route === '/contact' ? (
        <ContactPage onNavigateHome={() => navigateTo('/')} />
      ) : (
        <>
          {/* Animated Hero Section with Fanned-Out Wallet Stage */}
          <HeroSection />

          {/* What We Do Bento Grid Section */}
          <WhatWeDo />

          {/* Target sections for anchor navigation */}
          <main className="skyline-content">
            <section id="about" className="skyline-section" aria-label="About Section" />
            <section id="services" className="skyline-section" aria-label="Services Section" />

            {/* Selected Projects Work Section */}
            <WorkSection />

            {/* Contact Section — also mounted on single page */}
            <section id="contact" className="skyline-section" aria-label="Contact Section">
              <ContactPage onNavigateHome={() => navigateTo('/')} isInline={true} />
            </section>
          </main>
        </>
      )}

      {/* Skyline Studio Footer */}
      <Footer
        onNavigateContact={() => navigateTo('/contact')}
        onNavigateSection={(hash) => navigateTo('/', hash)}
      />
    </div>
  );
}

export default App;
