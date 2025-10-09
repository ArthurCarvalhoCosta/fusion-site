// src/components/Header/Header.jsx
import './Header.css'
import logoImg from '@/assets/img/logo.png'
import avatarImg from '@/assets/img/avatar.png'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import Avatar from '@/components/Avatar/Avatar'; // <-- novo

export const Header = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      handleScrollTo('Home');
      return;
    }
    navigate('/', { state: { scrollTo: 'Home' } });
  };

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.6 }
    );
    sections.forEach(section => observer.observe(section));
    return () => sections.forEach(section => observer.unobserve(section));
  }, []);

  // 🔹 Carrega usuário do localStorage e sincroniza entre abas
  useEffect(() => {
    const loadUser = () => {
      const raw = localStorage.getItem('usuario') || localStorage.getItem('user');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          // Normalize: ensure modalidade, plano and avatarUrl exist (empty string if absent)
          parsed.modalidade = parsed.modalidade ?? parsed.modality ?? parsed?.modalidade ?? "";
          parsed.plano = parsed.plano ?? parsed.plan ?? parsed?.plano ?? "";
          parsed.avatarUrl = parsed.avatarUrl ?? parsed.avatar ?? parsed?.avatarUrl ?? "";
          setUser(parsed);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    loadUser();

    const onStorage = (e) => {
      if (e.key === 'usuario' || e.key === 'user' || e.key === 'token') loadUser();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const menuItems = [
    { id: 'Home', label: 'Início' },
    { id: 'Training', label: 'Treino' },
    { id: 'differentials', label: 'Diferenciais' },
    { id: 'HowItWorks', label: 'Como Funciona' },
    { id: 'testimonials', label: 'Depoimentos' },
    { id: 'Contact', label: 'Contato' },
    { id: 'Start', label: 'Começar' },
  ];

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    const headerOffset = 100;
    const offsetPosition =
      element.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleEntrar = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <>
      <header className="header-container">
        <a
          href="#Home"
          className="logo"
          onClick={handleLogoClick}
          aria-label="Ir para o início"
          title="Início"
        >
          <img src={logoImg} alt="Logo Fusion" />
        </a>

        <nav className="nav-menu">
          {menuItems.map(item => (
            <a
              key={item.id}
              className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Área direita: Avatar ou botão Entrar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate('/profile')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/profile'); }}
              title="Perfil"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              {/* usa componente Avatar */}
              <Avatar user={user} size={44} className="avatar-header" />
            </div>
          ) : (
            <button
              className="btn-entrar-header"
              onClick={handleEntrar}
              title="Entrar"
            >
              Entrar
            </button>
          )}
        </div>

        {/* menu mobile */}
        <div className="menu-toggle" onClick={() => setIsMenuOpen(true)} aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </header>

      {isMenuOpen && <div className="overlay" onClick={() => setIsMenuOpen(false)} />}

      <aside className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={() => setIsMenuOpen(false)}>×</button>
        <ul>
          {menuItems.map(item => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo(item.id);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Área de perfil no mobile */}
        <div className="mobile-profile">
          {user ? (
            <div style={{ cursor: "pointer" }} onClick={() => navigate("/profile")}>
              <Avatar user={user} size={56} className="mobile-avatar" />
            </div>
          ) : (
            <button
              className="btn-entrar-header mobile"
              onClick={handleEntrar}
              aria-label="Entrar"
              type="button"
            >
              Entrar
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
