// src/components/Header/Header.jsx
import './Header.css'
import logoImg from '@/assets/img/logo.png'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import Avatar from '@/components/Avatar/Avatar';

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

  useEffect(() => {
    const loadUser = () => {
      const raw = localStorage.getItem('usuario') || localStorage.getItem('user');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);

          parsed.modalidade = parsed.modalidade ?? parsed.modality ?? "";
          parsed.plano = parsed.plano ?? parsed.plan ?? "";
          parsed.avatarUrl = parsed.avatarUrl ?? parsed.avatar ?? "";

          const tipoOriginal = parsed.tipo ?? parsed.type ?? parsed.role ?? "";
          const tipoLower = tipoOriginal.toLowerCase();

          if (tipoLower.includes("aluno")) parsed.type = "student";
          else if (tipoLower.includes("admin")) parsed.type = "admin";
          else if (tipoLower.includes("personal")) parsed.type = "personal";
          else parsed.type = "student";

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
      if (["usuario", "user", "token"].includes(e.key)) loadUser();
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const menuItems = [
    { id: 'Home', label: 'Início' },
    { id: 'treino', label: 'Treino' }, // <-- id único para tratar navegação
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

  const navigateByType = () => {
    if (!user) return navigate("/profile");

    if (user.type === "student") navigate("/profile/student");
    else if (user.type === "admin") navigate("/profile/admin");
    else if (user.type === "personal") navigate("/profile/personal");
    else navigate("/profile");
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
              href="#"
              onClick={(e) => {
                e.preventDefault();

                // 👉 SE FOR O BOTÃO "TREINO" → ir para /weeklyworkout
                if (item.id === "treino") {
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }, 100);
                  navigate("/weeklyworkout");
                  return;
                }

                // Se NÃO estiver na home → navega e pede scroll depois
                if (location.pathname !== "/") {
                  navigate("/", { state: { scrollTo: item.id } });
                  return;
                }

                // Se já estiver na home → scroll suave
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
              onClick={navigateByType}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") navigateByType();
              }}
              title="Perfil"
              style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
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
                href="#"
                onClick={(e) => {
                  e.preventDefault();

                  // 👉 MOBILE: Treino também vai para a rota
                  if (item.id === "treino") {
                    setIsMenuOpen(false);
                    navigate("/weeklyworkout");
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 100);
                    return;
                  }

                  if (location.pathname !== "/") {
                    setIsMenuOpen(false);
                    navigate("/", { state: { scrollTo: item.id } });
                    return;
                  }

                  handleScrollTo(item.id);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Perfil mobile */}
        <div className="mobile-profile">
          {user ? (
            <div style={{ cursor: "pointer" }} onClick={navigateByType}>
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
