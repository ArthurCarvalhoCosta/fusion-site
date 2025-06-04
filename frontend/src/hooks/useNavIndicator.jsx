import { useState, useEffect, useRef } from 'react';

export function useNavIndicator(initialIndex = 0) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrolled(window.scrollY > 1);
      }, 1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const navLinks = navRef.current?.querySelectorAll('a');
    const activeLink = navLinks?.[activeIndex];
    if (activeLink && indicatorRef.current) {
      indicatorRef.current.style.left = activeLink.offsetLeft + 'px';
      indicatorRef.current.style.width = activeLink.offsetWidth + 'px';
    }
  }, [activeIndex]);

  const handleLinkClick = (index, event) => {
    event.preventDefault();
    setActiveIndex(index);

    const targetId = event.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 80; // ajuste se necessário
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return { activeIndex, scrolled, navRef, indicatorRef, handleLinkClick };
}