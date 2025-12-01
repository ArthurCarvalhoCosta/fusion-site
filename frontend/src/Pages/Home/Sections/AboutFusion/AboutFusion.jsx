import { useNavigate } from 'react-router-dom';
import './AboutFusion.css';

export const AboutFusion = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/about');
  };

  return (
    <section className="about-fusion" aria-label="Seção sobre a Fusion">
      <div className="about-fusion-content">
        <h2 className="about-fusion-title">Sobre a Fusion</h2>
        <p className="about-fusion-description">
          Acompanhe sua ingestão diária de água com nosso contador inteligente.
          Beba a quantidade certa, alcance suas metas e garanta mais saúde e desempenho nos treinos!
        </p>
        <button
          className="about-fusion-button"
          aria-label="Ler mais sobre a Fusion"
          onClick={handleClick}
        >
          Ler mais
        </button>
      </div>
    </section>
  );
};
