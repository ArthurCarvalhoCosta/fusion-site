import "./HowItWorks.css";
import exampleVideo from "@/assets/videos/examplevideo.mp4";

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
        <video
          className="video-player"
          controls
          src={exampleVideo}
          aria-label="Vídeo explicativo de como funciona"
        />
      </div>
    </section>
  );
};
