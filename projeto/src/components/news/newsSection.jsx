// src/components/News/News.jsx
import { useEffect, useState } from 'react';
import './News.css';

function News() {
  const [noticias, setNoticias] = useState([]);

  const palavrasChave = [
    'treino',
    'musculação',
    'academia',
    'nutrição',
    'hipertrofia',
    'exercício'
  ];

  const imagensPorTema = {
    treino: require('../../assets/img/noticia-treino.png'),
    musculação: require('../../assets/img/noticia-musculacao.png'),
    academia: require('../../assets/img/noticia-academia.png'),
    nutrição: require('../../assets/img/noticia-nutricao.png'),
    hipertrofia: require('../../assets/img/noticia-hipertrofia.png'),
    exercício: require('../../assets/img/noticia-exercicio.png')
  };

  const imagemPadrao = require('../../assets/img/noticia-padrao.png');

  useEffect(() => {
    fetch("https://api.rss2json.com/v1/api.json?rss_url=https://www.hipertrofia.org/blog/feed/")
      .then(res => res.json())
      .then(data => {
        const usadas = new Set();

        const filtradas = data.items.filter(noticia =>
          palavrasChave.some(p =>
            (noticia.title + noticia.description).toLowerCase().includes(p)
          )
        ).slice(0, 3).map(noticia => {
          let imagem = imagemPadrao;

          for (const chave in imagensPorTema) {
            if ((noticia.title + noticia.description).toLowerCase().includes(chave) && !usadas.has(imagensPorTema[chave])) {
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