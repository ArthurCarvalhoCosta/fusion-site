import './Differentials.css';

import treinoIcon from "@/assets/img/check.png";
import equipeIcon from "@/assets/img/check.png";
import ambienteIcon from "@/assets/img/check.png";
import resultadoIcon from "@/assets/img/check.png";

const items = [
  {
    title: 'Treinos completos',
    description: 'Funcional + lutas em um só lugar.',
    icon: treinoIcon,
  },
  {
    title: 'Equipe qualificada',
    description: 'Professores experientes e certificados.',
    icon: equipeIcon,
  },
  {
    title: 'Ambiente acolhedor',
    description: 'Clima familiar, respeitoso e motivador.',
    icon: ambienteIcon,
  },
  {
    title: 'Resultados reais',
    description: 'Foco em evolução física e mental.',
    icon: resultadoIcon,
  },
];

export const Differentials = () => {
  return (
    <section
      className="fusion-differentials"
      id="differentials"
      aria-label="Diferenciais da Fusion"
    >
      <div className="section-title">
        <span className="background-number">01</span>
        <h2>
          Diferenciais da <br />
          <span className="highlight">Fusion</span>
        </h2>
      </div>

      <div className="fusion-differentials-grid">
        {items.map((item, index) => (
          <article className="fusion-differentials-card" key={index}>
            <div className="fusion-differentials-icon">
              <img src={item.icon} alt={item.title} />
            </div>
            <h3 className="fusion-differentials-item-title">{item.title}</h3>
            <p className="fusion-differentials-item-description">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
