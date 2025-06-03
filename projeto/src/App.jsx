import './assets/css/style.css'

import Header from './components/Header/Header';
import Home from './components/Home/HomeSection';
import Hydration from './components/Hydration/HydrationSection';
import News from './components/News/NewsSection';
import Contact from './components/Contact/ContactSection';

function App() {
  return (
    <>
      <Header />
      <main>
      <Home />
      <Hydration />
      <News />
      <Contact />
      </main>
    </>
  );
}

export default App;