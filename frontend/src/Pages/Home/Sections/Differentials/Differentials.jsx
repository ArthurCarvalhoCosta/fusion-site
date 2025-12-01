import './Differentials.css';

import icon1 from "@/assets/icons/differentials1.ico";
import icon2 from "@/assets/icons/differentials2.ico";
import icon3 from "@/assets/icons/differentials3.ico";
import icon4 from "@/assets/icons/differentials4.ico";

const items = [
  {
    title: 'Treinos completos',
    description: 'Funcional e artes marciais combinados para um desempenho completo.',
    icon: icon1,
  },
  {
    title: 'Equipe qualificada',
    description: 'Instrutores certificados, preparados para orientar você com segurança.',
    icon: icon2,
  },
  {
    title: 'Ambiente acolhedor',
    description: 'Atmosfera respeitosa e familiar, perfeita para seu desenvolvimento.',
    icon: icon3,
  },
  {
    title: 'Resultados reais',
    description: 'Concentre-se no progresso físico e mental, passo a passo.',
    icon: icon4,
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
