import React from 'react';
import './Footer.css';
import '../../assets/css/style.css';
import logo from '../../assets/img/logo.png';
import instagramIcon from '../../assets/img/instagram-icon.png';
import { useNavIndicator } from '../../hooks/useNavIndicator';

function Footer() {
  const { activeIndex, scrolled, navRef, indicatorRef, handleLinkClick } = useNavIndicator();

  const links = [
    { text: "Início", href: "#home" },
    { text: "Treino", href: "#" },
    { text: "Hidratação", href: "#hydration" },
    { text: "Notícias", href: "#news" },
    { text: "Contato", href: "#contact" },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <img src={logo} alt="Logo NiaKazi" className="footer-logo" />

        <nav className="footer-section" ref={navRef} style={{ position: 'relative' }}>
          <h3>Links Úteis</h3>
          <ul className="footer-links-list">
            {links.map(({ text, href }, index) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => handleLinkClick(index, e)}
                  className={activeIndex === index ? 'active' : ''}
                >
                  {text}
                </a>
              </li>
            ))}
            <span className="footer-link-indicator" ref={indicatorRef}></span>
          </ul>
        </nav>

        <div className="footer-section">
          <h3>Contato</h3>
          <p>Rua tal, São Paulo - SP</p>
          <p>(11) 99999-9999</p>
          <img src={instagramIcon} alt="Instagram" className="social-icon" />
        </div>

        <div className="footer-section">
          <h3>Sobre Nós</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
            ex ea commodo consequat.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;