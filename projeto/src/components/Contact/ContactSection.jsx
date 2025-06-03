import './Contact.css';
import '../../assets/css/style.css';
import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openChatbot = () => {
    alert("Chatbot aberto! Como posso ajudar?");
  };

  return (
    <section id="contact" className="section contact">
    <div className="section-title">
        <span>03</span>
        <h2>
        Entre em
        <br />
        <strong>Contato</strong>
        </h2>
    </div>

    <div className="contact-container">
        <div className="contact-text">
        <h3>Atendimento Rápido e Fácil!</h3>
        <p>
            Nosso chatbot está disponível 24h por dia para responder suas dúvidas de forma instantânea. Precisa de ajuda? É só perguntar!
        </p>
        <ul>
            <li>Tire dúvidas sobre planos e serviços</li>
            <li>Atendimento sem filas, quando quiser</li>
            <li>Respostas rápidas e precisas</li>
        </ul>
        </div>

        <div className="form contact-form">
        <div className="input-group">
            <input type="text" placeholder="Nome Completo*" required />
        </div>
        <div className="input-group">
            <input type="email" placeholder="Endereço de email*" required />
        </div>
        <div className="input-group">
            <input type="text" placeholder="Assunto" />
        </div>
        <button type="submit" id="chatbotButton" className="btn btn-chat">
            ChatBot
        </button>
        </div>
    </div>
    </section>
  );
};

export default Contact;