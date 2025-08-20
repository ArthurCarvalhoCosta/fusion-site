import React, { useRef, useState, useEffect } from "react";
import "./Testimonials.css";
import quoteImg from "../../assets/img/quote.png";
import avatarPlaceholder from "../../assets/img/avatar.png"; 

const testimonials = [
  {
    name: "Nome A",
    age: "Idade",
    avatar: avatarPlaceholder,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    name: "Nome B",
    age: "Idade",
    avatar: avatarPlaceholder,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    name: "Nome C",
    age: "Idade",
    avatar: avatarPlaceholder,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    name: "Nome D",
    age: "Idade",
    avatar: avatarPlaceholder,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    name: "Nome E",
    age: "Idade",
    avatar: avatarPlaceholder,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
];

export const Testimonials = () => {
  const carouselRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const carousel = carouselRef.current;
    const firstCard = carousel.querySelector(".testimonial-card");
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = parseInt(getComputedStyle(carousel).gap) || 0;
    const cardIndex = 1;
    const containerWidth = carousel.offsetWidth;

    const scrollTo =
      Math.max(0, (cardWidth + gap) * cardIndex - containerWidth / 2 + cardWidth / 2);
    setTimeout(() => {
      carousel.scrollTo({ left: scrollTo, behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;

    function onScroll() {
      const cards = Array.from(carousel.querySelectorAll(".testimonial-card"));
      const center = carousel.scrollLeft + carousel.offsetWidth / 2;

      let closestIndex = 0;
      let minDistance = Infinity;

      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - cardCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIndex = i;
        }
      });

      setActiveIndex(closestIndex);
    }

    carousel.addEventListener("scroll", onScroll);
    onScroll();

    return () => carousel.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;

    function onMouseDown(e) {
      isDragging.current = true;
      carousel.classList.add("grabbing");
      startX.current = e.pageX - carousel.offsetLeft;
      scrollStart.current = carousel.scrollLeft;
    }

    function onMouseMove(e) {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX.current) * 1.5;
      carousel.scrollLeft = scrollStart.current - walk;
    }

    function endDrag() {
      isDragging.current = false;
      carousel.classList.remove("grabbing");
    }

    carousel.addEventListener("mousedown", onMouseDown);
    carousel.addEventListener("mousemove", onMouseMove);
    carousel.addEventListener("mouseup", endDrag);
    carousel.addEventListener("mouseleave", endDrag);

    return () => {
      carousel.removeEventListener("mousedown", onMouseDown);
      carousel.removeEventListener("mousemove", onMouseMove);
      carousel.removeEventListener("mouseup", endDrag);
      carousel.removeEventListener("mouseleave", endDrag);
    };
  }, []);

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="section-title">
        <span className="background-number">03</span>
        <h2>
          Depoimentos dos <br />
          <span className="highlight">Alunos</span>
        </h2>
      </div>

      <div className="testimonials-carousel" ref={carouselRef}>
        {testimonials.map((t, i) => (
          <div
            key={i}
            className={`testimonial-card ${i === activeIndex ? "active" : ""}`}
          >
            <div className="testimonial-header">
              <img
                src={t.avatar || avatarPlaceholder}
                alt={`Foto de ${t.name}`}
                className="testimonial-avatar"
              />
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
