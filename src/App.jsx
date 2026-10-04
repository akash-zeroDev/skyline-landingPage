import Navbar from './components/Navbar';
import HeroSection from './components/hero/HeroSection';
import WhatWeDo from './components/whatWeDo/WhatWeDo';
import WorkSection from './components/sections/WorkSection';
import './App.css';

function App() {
  return (
    <div className="skyline-app">
      <Navbar />

      {/* Animated Hero Section with Fanned-Out Wallet Stage */}
      <HeroSection />

      {/* What We Do Bento Grid Section (Chunk 1 of 7) */}
      <WhatWeDo />

      {/* Target sections for anchor navigation */}
      <main className="skyline-content">
        <section id="about" className="skyline-section" aria-label="About Section" />
        <section id="services" className="skyline-section" aria-label="Services Section" />
        
        {/* Selected Projects Work Section */}
        <WorkSection />

        <section id="contact" className="skyline-section" aria-label="Contact Section" />
      </main>
    </div>
  );
}

export default App;
