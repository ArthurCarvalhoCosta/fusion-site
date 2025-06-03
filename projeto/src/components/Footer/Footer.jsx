import React, { useState, useRef, useEffect } from 'react';
import "./Footer.css";
import '../../assets/css/style.css';

import logo from "../../assets/img/logo.png";
import instagramIcon from "../../assets/img/instagram-icon.png";

function Footer() {
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const indicatorRef = useRef(null);

  const links = [
    { text: "Início", href: "#home" },
    { text: "Treino", href: "#" },
    { text: "Hidratação", href: "#hydration" },
    { text: "Notícias", href: "#news" },
    { text: "Contato", href: "#contact" },
  ];

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrolled(window.scrollY > 1);
      }, 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const navLinks = navRef.current.querySelectorAll("a");
    const activeLink = navLinks[activeIndex];
    if (activeLink && indicatorRef.current) {
      indicatorRef.current.style.left = activeLink.offsetLeft + "px";
      indicatorRef.current.style.width = activeLink.offsetWidth + "px";
    }
  }, [activeIndex]);

  const handleLinkClick = (index, event) => {
    event.preventDefault();
    setActiveIndex(index);

    const targetId = event.currentTarget.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 80; // ajuste conforme seu header
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <img src={logo} alt="Logo NiaKazi" className="footer-logo" />

        <nav className="footer-section" ref={navRef} style={{ position: "relative" }}>
          <h3>Links Úteis</h3>
          <ul className="footer-links-list">
            {links.map(({ text, href }, index) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => handleLinkClick(index, e)}
                  className={activeIndex === index ? "active" : ""}
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