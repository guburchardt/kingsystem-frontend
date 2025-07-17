import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Múltiplas tentativas para garantir que o scroll funcione
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    };

    // Primeira tentativa imediata
    scrollToTop();

    // Segunda tentativa após um pequeno delay
    const timer1 = setTimeout(scrollToTop, 100);

    // Terceira tentativa após um delay maior
    const timer2 = setTimeout(scrollToTop, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname]);

  return null;
};

export default ScrollToTop; 