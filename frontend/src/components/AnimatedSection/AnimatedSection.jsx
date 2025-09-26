// src/components/AnimatedSection/AnimatedSection.jsx
import React, { useEffect, useRef, useState } from "react";
import "./AnimatedSection.css";

const AnimatedSection = ({ children }) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target); // anima apenas uma vez
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`animated-section ${visible ? "visible" : ""}`}>
      {children}
    </div>
  );
};

export default AnimatedSection;
