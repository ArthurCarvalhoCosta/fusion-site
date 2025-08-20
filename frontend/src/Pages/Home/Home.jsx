import { Header } from '../../components/Header/Header.jsx'
import { Footer } from '../../components/Footer/Footer.jsx'
import { HeroSection } from './Sections/HeroSection/Hero.jsx'
import { AboutFusion } from './Sections/AboutFusion/AboutFusion.jsx' 
import { Differentials } from './Sections/Differentials/Differentials.jsx'
import { HowItWorks } from './Sections/HowItWorks/HowItWorks.jsx'
import { Testimonials } from './Sections/Testimonials/Testimonials.jsx'
import { Contact } from './Sections/Contact/Contact.jsx'
import { CallToAction } from './Sections/CallToAction/CallToAction.jsx'

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
