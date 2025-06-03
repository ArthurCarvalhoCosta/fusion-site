import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import logo from '../../assets/img/logo.png';
import perfilIcon from '../../assets/img/perfil-icon.png';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrolled(window.scrollY > 1);
      }, 1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const navLinks = navRef.current.querySelectorAll('a');
    const activeLink = navLinks[activeIndex];
    if (activeLink && indicatorRef.current) {
      indicatorRef.current.style.left = activeLink.offsetLeft + 'px';
      indicatorRef.current.style.width = activeLink.offsetWidth + 'px';
    }
  }, [activeIndex]);

  const handleLinkClick = (index, event) => {
    event.preventDefault();
    setActiveIndex(index);

    const targetId = event.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 80; // ajuste conforme seu header
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const links = [
    { text: 'Início', href: '#inicio' },
    { text: 'Hidratação', href: '#hidratacao' },
    { text: 'Notícias', href: '#noticias' },
    { text: 'Contato', href: '#contato' },
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