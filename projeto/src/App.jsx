import Header from './components/Header/Header';
import HomeSection from './components/Home/HomeSection';
import HydrationSection from './components/Hydration/HydrationSection';
import NewsSection from './components/News/NewsSection';
import ContactSection from './components/Contact/ContactSection';

function App() {
  return (
    <>
      <Header />
      <main>
        <HomeSection />
        <HydrationSection />
        <NewsSection />
        <ContactSection />
      </main>
    </>
  );
}

export default App;