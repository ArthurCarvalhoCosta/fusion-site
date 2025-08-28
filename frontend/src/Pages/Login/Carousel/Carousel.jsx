import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carousel.css";

import img1 from "../../../assets/img/imageLogin1.png";
import img2 from "../../../assets/img/imageLogin2.png";
import img3 from "../../../assets/img/imageLogin3.png";

const Carousel = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false,
    swipe: false,
    pauseOnHover: false,
    speed: 800,
    cssEase: "ease-in-out",
    appendDots: dots => (
      <div style={{ bottom: "20px" }}>
        <ul> {dots} </ul>
      </div>
    ),
    customPaging: () => <div className="dot" />
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        <div className="carousel-slide">
          <img src={img1} alt="Imagem 1" className="carousel-img" />
          <div className="carousel-overlay"></div>
          <div className="carousel-text">Seu futuro começa com uma escolha saudável.</div>
        </div>
        <div className="carousel-slide">
          <img src={img2} alt="Imagem 2" className="carousel-img" />
          <div className="carousel-overlay"></div>
          <div className="carousel-text">Cada treino é um passo mais perto da vitória.</div>
        </div>
        <div className="carousel-slide">
          <img src={img3} alt="Imagem 3" className="carousel-img" />
          <div className="carousel-overlay"></div>
          <div className="carousel-text">Um espaço feito para você evoluir.</div>
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;
