
import Header from '../site-components/Header';
import Footer from '../site-components/Footer';
import HeroSection from '../site-components/HeroSection';
import CatalogoSection from '../site-components/CatalogoSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <HeroSection />
      <CatalogoSection />
      <Footer />
    </div>
  );
};

export default Index;
