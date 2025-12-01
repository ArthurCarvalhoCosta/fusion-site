import React from "react";
import "./Footer.css";
import logo from "@/assets/img/logo.png";
import { Instagram, Facebook } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-columns">
        {/* ==== LOGO ==== */}
        <div className="footer-column footer-logo">
          <img src={logo} alt="Fusion Logo" />
        </div>

        {/* ==== LINKS ÚTEIS ==== */}
        <div className="footer-column">
          <h3>Links Úteis</h3>
          <ul>
            <li><a href="#Home">Início</a></li>
            <li><a href="#Training">Treino</a></li>
            <li><a href="#Differentials">Diferenciais</a></li>
            <li><a href="#HowItWorks">Como Funciona</a></li>
            <li><a href="#Testimonials">Depoimentos</a></li>
            <li><a href="#Contact">Contato</a></li>
            <li><a href="#Start">Começar</a></li>
          </ul>
        </div>

        {/* ==== CONTATO ==== */}
        <div className="footer-column">
          <h3>Contato</h3>
          <p><a href="tel:+5511920568298">(11) 92056-8298</a></p>
          <p><a href="mailto:fusion.fightfitness@gmail.com">fusion.fightfitness@gmail.com</a></p>
          <p>
            <a
              href="https://maps.google.com/?q=Estr.+do+Corredor,+531+-+Parque+Pan+Americano,+São+Paulo+-+SP,+02992-210"
              target="_blank"
              rel="noopener noreferrer"
            >
              Estr. do Corredor, 531<br />
              Parque Pan Americano, SP
            </a>
          </p>
        </div>

        {/* ==== REDES SOCIAIS ==== */}
        <div className="footer-column footer-social">
          <h3>Redes Sociais</h3>
          <div className="footer-icons">
            <a
              href="https://www.instagram.com/fusionfightfitness"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={28} />
            </a>
            <a
              href="https://www.facebook.com/people/Fusion-Fight-Fitness/61555899474339/?_rdr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook size={28} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
