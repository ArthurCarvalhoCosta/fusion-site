import React from 'react';
import Hero from './Hero/HeroSection';
import News from './News/NewsSection';
import Hydration from './Hydration/HydrationSection';
import Contact from './Contact/ContactSection';

const Home = () => {
  return (
    <>
      <Hero />
      <Hydration />
      <News />
      <Contact />
    </>
  );
};

export default Home;