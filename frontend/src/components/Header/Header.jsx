import './Header.css'
import logoImg from '@/assets/img/logo.png'
import avatarImg from '@/assets/img/avatar.png'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

export const Header = () => {
  const [activeSection, setActiveSection] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
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
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { root: null, threshold: 0.6 }
    )
    sections.forEach(section => observer.observe(section))
    return () => sections.forEach(section => observer.unobserve(section))
  }, [])

  // carrega usuário do localStorage e sincroniza entre abas
  useEffect(() => {
    const loadUser = () => {
      const raw = localStorage.getItem('usuario')
      if (raw) {
        try {
          setUser(JSON.parse(raw))
        } catch {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    }
    loadUser()

    const onStorage = (e) => {
      if (e.key === 'usuario' || e.key === 'token') loadUser()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const menuItems = [
    { id: 'Home', label: 'Início' },
    { id: 'Training', label: 'Treino' },
    { id: 'differentials', label: 'Diferenciais' },
    { id: 'HowItWorks', label: 'Como Funciona' },
    { id: 'testimonials', label: 'Depoimentos' },
    { id: 'Contact', label: 'Contato' },
    { id: 'Start', label: 'Começar' },
  ]

  const handleScrollTo = (id) => {
    const element = document.getElementById(id)
    if (!element) return
    const headerOffset = 100
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - headerOffset

    window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  const handleEntrar = (e) => {
    e.preventDefault()
    navigate('/login')
  }

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
                e.preventDefault()
                handleScrollTo(item.id)
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* area direita do header: avatar OR entrar (sem placeholders que ocupam espaço) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* avatar (aparece só quando user existe) */}
          {user ? (
            <div className="profile-icon" aria-live="polite">
              <img src={avatarImg} alt="Perfil" />
            </div>
          ) : null}

          {/* botão "Entrar" (renderizado somente quando não há usuário) */}
          {!user ? (
            <div className="profile-action">
              <button
                className="btn-entrar-header"
                onClick={handleEntrar}
                aria-label="Entrar"
                title="Entrar"
                type="button"
              >
                Entrar
              </button>
            </div>
          ) : null}
        </div>

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
                  e.preventDefault()
                  handleScrollTo(item.id)
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* mobile profile area: se não houver user, mostra o botão "Entrar" (estilizado full-width) */}
        <div className="mobile-profile">
          {user ? (
            <img src={avatarImg} alt="Perfil" />
          ) : (
            <button className="btn-entrar-header mobile" onClick={handleEntrar} aria-label="Entrar" type="button">
              Entrar
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
