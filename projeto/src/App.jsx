import './assets/css/style.css'

import Header from './components/Header/Header';
import Home from './components/Home/HomeSection';
import Hydration from './components/Hydration/HydrationSection';
import News from './components/News/NewsSection';

function App() {
  return (
    <>
      <Header />
      <main>
      <Home />
      <Hydration />
      <News />
      </main>
    </>
  );
}

export default App;