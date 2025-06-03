import { useState } from 'react';
import './Hydration.css';
import aguaIcon from '../../assets/img/agua-icon.png';

const Hydration = () => {
  const [ml, setMl] = useState('--');
  const [litros, setLitros] = useState('--');

  const calcularAgua = () => {
    const pesoInput = document.getElementById('peso');
    const mlSpan = document.getElementById('ml');
    const litrosSpan = document.getElementById('litros');

    const peso = parseFloat(pesoInput.value);

    if (!isNaN(peso) && peso > 0) {
        const ml = peso * 35;
        const litros = (ml / 1000).toFixed(2);

        mlSpan.textContent = ml.toFixed(0);
        litrosSpan.textContent = litros;
    } else {
        mlSpan.textContent = '0000';
        litrosSpan.textContent = '0.0';
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
              <input type="number" placeholder="Idade" id="idade" />
              <span>Anos</span>
            </div>
            <div className="input-group">
              <input type="number" placeholder="Altura" id="altura" />
              <span>Cm</span>
            </div>
            <div className="input-group">
              <input type="number" placeholder="Peso" id="peso" />
              <span>Kg</span>
            </div>
            <button type="button" className="btn btn-hydration" onClick={calcularAgua}>
              Calcular
            </button>
          </div>

          <div className="hydration-result">
            <img src={aguaIcon} alt="Ícone de garrafa de água" />
            <p>
              Você deve beber cerca de <span id="ml">{ml}</span> mL <br />
              <span id="litros">{litros}</span> L por dia.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hydration;