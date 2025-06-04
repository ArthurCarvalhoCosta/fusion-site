import './Hero.css';
import '../../../assets/css/style.css';
import bannerImg from '../../../assets/img/banner.png';

const HomeSection = () => {
  return (
    <>
      <section
        id="home"
        className="section home"
        style={{
          backgroundImage: `url(${bannerImg})`,
          backgroundSize: 'contain',
          height: '100vh'
        }}
      >
        <div className="home-right">
          <h1>Aqui começa sua jornada para uma vida mais saudável!</h1>
          <p>
            Crie sua ficha de treino personalizada e alcance seus objetivos com precisão.
            Simples, rápido e do seu jeito
          </p>
          <button className="btn btn-red">Comece Agora</button>
        </div>
      </section>
    </>
  );
};

export default HomeSection;