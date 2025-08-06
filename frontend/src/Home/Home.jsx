import { Header } from '../components/Header/Header.jsx'
import { HeroSection } from './HeroSection/Hero.jsx'
import { AboutFusion } from './AboutFusion/AboutFusion.jsx' 
import { Differentials } from './Differentials/Differentials.jsx'
import { HowItWorks } from './HowItWorks/HowItWorks.jsx'
import { Testimonials } from './Testimonials/Testimonials.jsx'

export const Home = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <AboutFusion />
      <Differentials />
      <HowItWorks />
      <Testimonials />
    </>
  )
}
