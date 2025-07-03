import { Header } from '../../components/Header/Header.tsx'
import { HeroSection } from './HeroSection/Hero.tsx'
import { AboutFusion } from './AboutFusion/AboutFusion.tsx' 

export const Home = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <AboutFusion />
    </>
  )
}
