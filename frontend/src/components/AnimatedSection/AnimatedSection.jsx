import React, { useEffect, useRef, useState } from "react";
import "./AnimatedSection.css";

const AnimatedSection = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // entry.intersectionRatio = % visível do elemento
        if (entry.intersectionRatio >= 0.3) {  
          setAnimated(true);      // ativa a animação
          observer.unobserve(el); // garante que só anima 1 vez
        }
      },
      {
        threshold: [0, 0.3, 1], // garante precisão no ponto de 30%
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`animated-section ${animated ? "visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
