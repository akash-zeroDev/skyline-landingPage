import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/hero/HeroSection';
import WhatWeDo from './components/whatWeDo/WhatWeDo';
import OurServices from './components/services/OurServices';
import WorkSection from './components/sections/WorkSection';
import WorkflowDialSection from './components/workflow/WorkflowDialSection';
import Testimonials from './components/testimonials/Testimonials';
import FaqSection from './components/faq/FaqSection';
import ContactPage from './components/contact/ContactPage';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import Footer from './components/footer/Footer';
import './App.css';

const getRouteFromLocation = () => {
  if (typeof window === 'undefined') return '/';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  if (path.includes('/contact')) return '/contact';
  if (path.includes('/privacy')) return '/privacy';
  if (hash === '#contact') return '/contact';
  return '/';
};

function App() {
  const [route, setRoute] = useState(getRouteFromLocation);
  const routeRef = useRef(route);

  useEffect(() => {
    const handleLocationChange = () => {
      const nextRoute = getRouteFromLocation();
      if (
        nextRoute !== routeRef.current &&
        (nextRoute === '/contact' || nextRoute === '/privacy')
      ) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      routeRef.current = nextRoute;
      setRoute(nextRoute);
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
      routeRef.current = '/contact';
      setRoute('/contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (newRoute === '/privacy') {
      window.history.pushState({}, '', '/privacy');
      routeRef.current = '/privacy';
      setRoute('/privacy');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const url = targetHash ? `/${targetHash}` : '/';
      window.history.pushState({}, '', url);
      routeRef.current = '/';
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
      ) : route === '/privacy' ? (
        <PrivacyPolicy onNavigateHome={() => navigateTo('/')} />
      ) : (
        <>
          {/* Animated Hero Section with Fanned-Out Wallet Stage */}
          <HeroSection />

          {/* What We Do Bento Grid Section */}
          <WhatWeDo />

          {/* Target sections for anchor navigation */}
          <main className="skyline-content">
            {/* Our Services — capability grid */}
            <OurServices />

            {/* How We Work — Studio Workflow Scrolling Dial Section */}
            <WorkflowDialSection />

            {/* Selected Projects Work Section */}
            <WorkSection />

            {/* Client Testimonials — bento grid / mobile carousel */}
            <Testimonials />

            {/* FAQ — accordion */}
            <FaqSection />

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
        onNavigatePrivacy={() => navigateTo('/privacy')}
        onNavigateSection={(hash) => navigateTo('/', hash)}
      />
    </div>
  );
}

export default App;
