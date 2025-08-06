import { Header } from '../components/Header/Header.jsx'
import { Footer } from '../components/Footer/Footer.jsx'
import { HeroSection } from './HeroSection/Hero.jsx'
import { AboutFusion } from './AboutFusion/AboutFusion.jsx' 
import { Differentials } from './Differentials/Differentials.jsx'
import { HowItWorks } from './HowItWorks/HowItWorks.jsx'
import { Testimonials } from './Testimonials/Testimonials.jsx'
import { Contact } from './Contact/Contact.jsx'
import { CallToAction } from './CallToAction/CallToAction.jsx'

export const Home = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <AboutFusion />
      <Differentials />
      <HowItWorks />
      <Testimonials />
      <Contact />
      <CallToAction />
      <Footer />
    </>
  )
}
