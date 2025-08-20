import './Header.css'
import logoImg from '../../assets/img/logo.png'
import avatarImg from '../../assets/img/avatar.png'
import { useEffect, useState } from 'react'

export const Header = () => {
  const [activeSection, setActiveSection] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    const headerOffset = 100
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - headerOffset

    window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className="header-container">
        <div className="logo">
          <img src={logoImg} alt="Logo Fusion" />
        </div>

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

        <div className="profile-icon">
          <img src={avatarImg} alt="Perfil" />
        </div>

        <div className="menu-toggle" onClick={() => setIsMenuOpen(true)}>
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
        <div className="mobile-profile">
          <img src={avatarImg} alt="Perfil" />
        </div>
      </aside>
    </>
  )
}
