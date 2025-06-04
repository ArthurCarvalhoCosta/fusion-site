import { useEffect, useState } from 'react';
import './News.css';
import '../../../assets/css/style.css';

const palavrasChave = [
  'treino',
  'musculação',
  'academia',
  'nutrição',
  'hipertrofia',
  'exercício'
];

import treinoImg from '../../../assets/img/noticia-treino.png';
import musculacaoImg from '../../../assets/img/noticia-musculacao.png';
import academiaImg from '../../../assets/img/noticia-academia.png';
import nutricaoImg from '../../../assets/img/noticia-nutricao.png';
import hipertrofiaImg from '../../../assets/img/noticia-hipertrofia.png';
import exercicioImg from '../../../assets/img/noticia-exercicio.png';
import padraoImg from '../../../assets/img/noticia-padrao.png';

const imagensPorTema = {
  treino: treinoImg,
  musculação: musculacaoImg,
  academia: academiaImg,
  nutrição: nutricaoImg,
  hipertrofia: hipertrofiaImg,
  exercício: exercicioImg
};

const imagemPadrao = padraoImg;

function News() {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    fetch("https://api.rss2json.com/v1/api.json?rss_url=https://www.hipertrofia.org/blog/feed/")
      .then(res => res.json())
      .then(data => {
        const usadas = new Set();

        const filtradas = data.items
          .filter(noticia =>
            palavrasChave.some(p =>
              (noticia.title + noticia.description).toLowerCase().includes(p)
            )
          )
          .slice(0, 3)
          .map(noticia => {
            let imagem = imagemPadrao;

            for (const chave in imagensPorTema) {
              if (
                (noticia.title + noticia.description).toLowerCase().includes(chave) &&
                !usadas.has(imagensPorTema[chave])
              ) {
                imagem = imagensPorTema[chave];
                usadas.add(imagem);
                break;
              }
            }

            return {
              titulo: noticia.title,
              link: noticia.link,
              imagem: imagem
            };
          });

        setNoticias(filtradas);
      })
      .catch(err => console.error("Erro ao carregar notícias:", err));
  }, []);

  return (
    <section id="news" className="section news">
      <div className="section-title">
        <span className="section-number">02</span>
        <h2>
          Últimas<br /><strong>Notícias</strong>
        </h2>
      </div>

      <div className="news-card-group">
        {noticias.map((noticia, index) => (
          <div key={index} className="news-card loaded">
            <img src={noticia.imagem} alt={noticia.titulo} />
            <div className="news-content">
              <h3>{noticia.titulo}</h3>
              <a href={noticia.link} target="_blank" rel="noopener noreferrer" className="news-link">
                Ler mais
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default News;