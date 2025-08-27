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
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    speed: 800,
    cssEase: "ease-in-out"
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        <div>
          <img src={img1} alt="Imagem 1" className="carousel-img" />
        </div>
        <div>
          <img src={img2} alt="Imagem 2" className="carousel-img" />
        </div>
        <div>
          <img src={img3} alt="Imagem 3" className="carousel-img" />
        </div>
      </Slider>
    </div>
  );
};

export default Carousel;