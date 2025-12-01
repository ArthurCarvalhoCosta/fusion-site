import React, { useState } from "react";
import "./About.css";
import { Header } from "@/components/Header/Header.jsx";
import { Footer } from "@/components/Footer/Footer.jsx";

import img1 from "@/assets/img/imageGalery1.png";
import img2 from "@/assets/img/imageGalery2.png";
import img3 from "@/assets/img/imageGalery3.png";
import exampleVideo from "@/assets/videos/examplevideo.mp4";

export default function About() {
  const slides = [img1, img2, img3];
  const [idx, setIdx] = useState(0);

  const next = () => setIdx((i) => (i + 1) % slides.length);
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);

  return (
    <>
      <Header />

      <main className="about">
        {/* ===== 01 - SOBRE A FUSION ===== */}
        <div className="section-title">
          <h2>
            Sobre a <br />
            <span className="highlight">Fusion</span>
          </h2>
        </div>

        {/* ===== 02 - NOSSA MISSÃO ===== */}
        <section className="container about__mission">
          <div className="about__missionText">
            <div className="section-title">
              <span className="background-number">01</span>
              <h2>
                Nossa <br />
                <span className="highlight">Missão</span>
              </h2>
            </div>

            <p>
              Nossa missão é transformar vidas por meio da força, disciplina e
              espírito das artes marciais. Boxe, Jiu-Jitsu e Treinamento
              Funcional são mais do que modalidades – são caminhos de superação
              pessoal e coletiva.
            </p>

            <p>
              Pellentesque habitant morbi tristique senectus et netus et
              malesuada fames ac turpis egestas. Maecenas nec turpis a magna
              gravida hendrerit. In eget justo a libero iaculis ultricies.
            </p>
          </div>

          <div className="about__missionMedia">
            <div className="circle-shape"></div>
          </div>
        </section>

        {/* ===== 03 - NOSSA HISTÓRIA ===== */}
        <section className="container about__history">
          <div className="section-title">
            <span className="background-number">02</span>
            <h2>
              Nossa <br />
              <span className="highlight">História</span>
            </h2>
          </div>

          <div className="about__historyGrid">
            <div className="about__video">
              <video src={exampleVideo} controls className="about__videoExample" />
            </div>

            <div className="about__historyText">
              <p>
                A Fusion Fight &amp; Fitness nasceu da inquietação de três amigos
                que passaram a vida nos tatames, nos ringues e nas ruas — não em
                busca de medalhas, mas de transformação. Depois de anos em
                academias tradicionais, cheias de máquinas, espelhos e pouco
                propósito, surgiu uma pergunta simples: e se existisse um lugar
                onde o treino fosse real?
              </p>
            </div>
          </div>

          <div className="about__historyLongText">
            <p>
              Foi assim que, em 2017, abrimos as portas — ou melhor, os portões —
              da nossa primeira unidade. Um espaço bruto, sem luxo, mas com alma.
              Aqui, o que conta é o suor, o respeito e a vontade de evoluir.
            </p>
            <p>
              Desde o começo, o foco foi claro: formar pessoas mais fortes por
              dentro e por fora, usando o Jiu-Jitsu, o Boxe e o Treinamento
              Funcional como ferramentas de mudança. Sem modinha, sem atalhos.
              Treino de verdade, com gente de verdade.
            </p>
            <p>
              Hoje, somos mais do que uma academia. Somos uma comunidade. E se
              você procura um lugar para se testar, se encontrar e se superar, o
              seu lugar também é aqui.
            </p>
          </div>
        </section>

        {/* ===== 04 - GALERIA ===== */}
        <section className="container about__gallery">
          <div className="section-title">
            <span className="background-number">03</span>
            <h2>
              Nossa Luta em <br />
              <span className="highlight">Cada Frame</span>
            </h2>
          </div>

          <div className="about__carousel">
            {slides.map((src, i) => (
              <figure
                key={src}
                className={`about__slide ${i === idx ? "is-active" : ""}`}
              >
                <img src={src} alt={`Slide ${i + 1}`} loading="lazy" />
              </figure>
            ))}

            {/* Botões com hover e click funcionando */}
            <button
              className="about__nav about__nav--prev"
              onClick={prev}
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              className="about__nav about__nav--next"
              onClick={next}
              aria-label="Próximo"
            >
              ›
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
