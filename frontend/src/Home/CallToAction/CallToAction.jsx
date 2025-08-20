import React from "react";
import "./CallToAction.css";

export const CallToAction = () => {
  return (
    <section className="call-to-action" id="Start">
      <div className="cta-content">
        <h2>Fale com a gente e comece sua evolução.</h2>
        <p>
          Junte-se aos nossos alunos e comece uma nova fase com treinos
          personalizados, acompanhamento profissional e tecnologia exclusiva.
          Fale com a gente e tire suas dúvidas agora mesmo!
        </p>
        <a
          href="https://wa.me/11912721511"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button"
        >
          Chamar no WhatsApp
        </a>
      </div>
      <div className="cta-image-placeholder"></div>
    </section>
  );
};
