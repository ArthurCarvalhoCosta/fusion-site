import { useState } from 'react';
import './Hydration.css';
import '../../../assets/css/style.css';
import aguaIcon from '../../../assets/img/agua-icon.png';

const Hydration = () => {
  const [peso, setPeso] = useState('');
  const [ml, setMl] = useState('--');
  const [litros, setLitros] = useState('--');

  const calcularAgua = () => {
    const pesoFloat = parseFloat(peso);

    if (!isNaN(pesoFloat) && pesoFloat > 0) {
      const mlCalculado = pesoFloat * 35;
      const litrosCalculado = (mlCalculado / 1000).toFixed(2);

      setMl(mlCalculado.toFixed(0));
      setLitros(litrosCalculado);
    } else {
      setMl('0000');
      setLitros('0.0');
      alert('Por favor, insira um peso válido para calcular.');
    }
  };

  return (
    <>
      <section id="message" className="section message">
        <h2>Mantenha-se hidratado!</h2>
        <p>
          Acompanhe sua ingestão diária de água com nosso contador inteligente.
          Beba a quantidade certa, alcance suas metas e garanta mais saúde e
          desempenho nos treinos!
        </p>
      </section>

      <section id="hydration" className="section hydration">
        <div className="section-title">
          <span>01</span>
          <h2>
            Contador de<br />
            <strong>Água</strong>
          </h2>
        </div>

        <div className="hydration-container">
          <div className="form hydration-form">
            <div className="input-group">
              <input type="number" placeholder="Idade" />
              <span>Anos</span>
            </div>
            <div className="input-group">
              <input type="number" placeholder="Altura" />
              <span>Cm</span>
            </div>
            <div className="input-group">
              <input
                type="number"
                placeholder="Peso"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
              />
              <span>Kg</span>
            </div>
            <button type="button" className="btn btn-hydration" onClick={calcularAgua}>
              Calcular
            </button>
          </div>

          <div className="hydration-result">
            <img src={aguaIcon} alt="Ícone de garrafa de água" />
            <p>
              Você deve beber cerca de <span>{ml}</span> mL <br />
              <span>{litros}</span> L por dia.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hydration;