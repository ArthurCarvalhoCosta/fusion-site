import React from "react";
import "./Contact.css";
import { FaCheck } from "react-icons/fa";
import botImg from "../../assets/img/botImg.png";

export const Contact = () => {
  return (
    <section className="contact-section" id="Contact">
      <div className="section-title">
        <span className="background-number">04</span>
        <h2>
          Entre em <br />
          <span className="highlight">Contato</span>
        </h2>
      </div>
      <div className="contact-content">
        <div className="contact-left">
          <h3>Entre em contato conosco</h3>
          <p>
            Você pode falar com a gente de forma rápida e prática! Estamos disponíveis tanto pelo WhatsApp quanto pelo nosso ChatBot, que funciona 24 horas por dia.
          </p>
          <ul className="benefits-list">
            <li><FaCheck className="check-icon" /> Tire dúvidas sobre planos e serviços</li>
            <li><FaCheck className="check-icon" /> Atendimento sem filas, quando quiser</li>
            <li><FaCheck className="check-icon" /> Respostas rápidas e precisas</li>
          </ul>
        </div>
        <div className="contact-right">
          <h4>ChatBot 24h! Respostas rápidas e precisas para o que você procura.</h4>
          <img src={botImg} alt="Chat Bot Icon" className="bot-icon" />
          <button className="contact-button">Iniciar Conversa</button>
        </div>
      </div>
    </section>
  );
};
