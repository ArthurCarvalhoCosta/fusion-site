import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Header } from '../../components/Header/Header.jsx';
import { Footer } from '../../components/Footer/Footer.jsx';
import { HeroSection } from './Sections/HeroSection/Hero.jsx';
import { AboutFusion } from './Sections/AboutFusion/AboutFusion.jsx';
import { Differentials } from './Sections/Differentials/Differentials.jsx';
import { HowItWorks } from './Sections/HowItWorks/HowItWorks.jsx';
import { Testimonials } from './Sections/Testimonials/Testimonials.jsx';
import { Contact } from './Sections/Contact/Contact.jsx';
import { CallToAction } from './Sections/CallToAction/CallToAction.jsx';
import AnimatedSection from '@/components/AnimatedSection/AnimatedSection.jsx';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const target = location.state?.scrollTo;
    if (target) {
      const el = document.getElementById(target);
      if (el) {
        const headerOffset = 115;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }

      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    }
  }, [location]);

  return (
    <>
      <Header />

      <HeroSection />
      <AboutFusion />
      <AnimatedSection><Differentials /></AnimatedSection>
      <AnimatedSection><HowItWorks /></AnimatedSection>
      <AnimatedSection><Testimonials /></AnimatedSection>
      <AnimatedSection><Contact /></AnimatedSection>
      <CallToAction />

      <Footer />
    </>
  );
};

export default Home;
