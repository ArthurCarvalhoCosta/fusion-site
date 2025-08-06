import React, { useRef, useState, useEffect } from "react";
import "./Testimonials.css";
import quoteImg from "../../assets/img/quote.png";

const testimonials = [
  {
    name: "Nome",
    age: "Idade",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    name: "Nome",
    age: "Idade",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    name: "Nome",
    age: "Idade",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    name: "Nome",
    age: "Idade",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    name: "Nome",
    age: "Idade",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
];

export const Testimonials = () => {
  const carouselRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const carousel = carouselRef.current;
    const cardWidth = 450;
    const gap = 50;
    const cardIndex = 1;

    const containerWidth = carousel.offsetWidth;
    const cardStart = (cardWidth + gap) * cardIndex;
    const scrollTo = Math.max(0, cardStart - containerWidth / 2 + cardWidth / 2);

    setTimeout(() => {
      carousel.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }, 100);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const carousel = carouselRef.current;
      const cards = Array.from(carousel.querySelectorAll(".testimonial-card"));
      const center = carousel.scrollLeft + carousel.offsetWidth / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(center - cardCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    const carousel = carouselRef.current;
    carousel.addEventListener("scroll", handleScroll);
    handleScroll(); // run on mount

    return () => {
      carousel.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseDown = (e) => {
    isDown.current = true;
    carouselRef.current.classList.add("grabbing");
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    carouselRef.current.classList.remove("grabbing");
  };

  const handleMouseUp = () => {
    isDown.current = false;
    carouselRef.current.classList.remove("grabbing");
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <section className="testimonials-section">
      <div className="section-title">
        <span className="background-number">03</span>
        <h2>
          Depoimentos dos <br />
          <span className="highlight">Alunos</span>
        </h2>
      </div>

      <div
        className="testimonials-carousel"
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {testimonials.map((t, i) => (
          <div
            key={i}
            className={`testimonial-card ${i === activeIndex ? "active" : ""}`}
          >
            <div className="testimonial-header">
              <div className="testimonial-avatar" />
              <div className="testimonial-info">
                <p>{t.name}</p>
                <p>{t.age}</p>
              </div>
              <img src={quoteImg} alt="Aspas" className="quote-icon" />
            </div>
            <p className="testimonial-text">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
