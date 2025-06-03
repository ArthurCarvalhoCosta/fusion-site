import './assets/css/style.css'

import Header from './components/Header/Header';
import Home from './pages/Home/home'
import Footer from './components/Footer/Footer';

function App() {
  return (
    <>
      <Header />
      <main>
        <Home />
      </main>
      <Footer />
    </>
  );
}

export default App;