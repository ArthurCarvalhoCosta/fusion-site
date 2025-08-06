import './Header.css'
import logoImg from '../../assets/img/logo.png'
import { useEffect, useState } from 'react'

export const Header = () => {
  const [activeSection, setActiveSection] = useState('')

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
      {
        root: null,
        threshold: 0.6,
      }
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

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }

  return (
    <header className="header-container">
      <div className="logo">
        <img
          src={logoImg}
          alt="Logo Fusion"
          style={{ width: '48px', height: '48px' }}
        />
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

      <div className="profile-icon" />
    </header>
  )
}
