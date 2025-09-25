import React from "react";
import "./Footer.css";
import logo from "@/assets/img/logo.png";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <img src={logo} alt="Fusion Logo" />
      </div>

      <div className="footer-columns">
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

        <div className="footer-column">
          <h3>Contato</h3>
          <p>(11) 98765-4321</p>
          <p>Adm123@gmail.com</p>
          <p>Rua Tal, 123 - São Paulo</p>
        </div>

        <div className="footer-column">
          <h3>Redes Sociais</h3>
          <p>Instagram</p>
          <p>Facebook</p>
        </div>
      </div>
    </footer>
  );
};
