import './Hero.css'
import heroImage from '@/assets/img/hero.png'

export const HeroSection = () => {
  return (
    <section
      className="hero-container"
      id="Home"
      aria-label="Seção inicial com chamada para jornada saudável"
    >
      <div className="content-wrapper">
        <div className="right-content">
          <h1 className="title-section">
            Aqui começa sua jornada para uma vida mais saudável!
          </h1>
          <p className="description">
            Crie sua ficha de treino personalizada e alcance seus objetivos com
            precisão. Simples, rápido e do seu jeito.
          </p>
          <button
            className="button"
            type="button"
            aria-label="Comece agora sua jornada"
          >
            Comece Agora
          </button>
        </div>
      </div>
    </section>
  )
}
