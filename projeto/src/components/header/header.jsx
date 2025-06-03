import React from 'react';
import './Header.css';
import '../../assets/css/style.css';
import logo from '../../assets/img/logo.png';
import perfilIcon from '../../assets/img/perfil-icon.png';
import { useNavIndicator } from '../../hooks/useNavIndicator';

const Header = () => {
  const { activeIndex, scrolled, navRef, indicatorRef, handleLinkClick } = useNavIndicator();

  const links = [
    { text: 'Início', href: '#home' },
    { text: 'Hidratação', href: '#hydration' },
    { text: 'Notícias', href: '#news' },
    { text: 'Contato', href: '#contact' },
  ];

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <img src={logo} alt="Logo Fusion" className="logo" />
      <div className="header-right">
        <nav className="nav" ref={navRef}>
          {links.map(({ text, href }, index) => (
            <a
              key={index}
              href={href}
              className={activeIndex === index ? 'active' : ''}
              onClick={(e) => handleLinkClick(index, e)}
            >
              {text}
            </a>
          ))}
          <span className="nav-indicator" ref={indicatorRef}></span>
        </nav>
        <img src={perfilIcon} alt="Acessar perfil do usuário" className="user-icon" />
      </div>
    </header>
  );
};

export default Header;