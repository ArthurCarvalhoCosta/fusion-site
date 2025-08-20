import "./HowItWorks.css";

export const HowItWorks = () => {
  return (
    <section className="how-it-works" id="HowItWorks" aria-label="Como Funciona">
      <div className="section-title">
        <span className="background-number">02</span>
        <h2>
          Como <br />
          <span className="highlight">Funciona</span>
        </h2>
      </div>

      <div className="video-wrapper" role="region" aria-label="Vídeo explicativo">
        <div className="video-placeholder">
          <button
            className="play-button"
            aria-label="Reproduzir vídeo"
            title="Reproduzir vídeo"
          >
            ▶
          </button>
        </div>
      </div>
    </section>
  );
};
