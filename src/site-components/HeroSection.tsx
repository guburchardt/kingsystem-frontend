import { Button } from './ui/button';
import { Phone, Star } from 'lucide-react';

const HeroSection = () => {
  const handleWhatsAppClick = () => {
    window.location.href = '/contato';
  };

  const handleKidsClick = () => {
    window.location.href = '/kids';
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dcnowyew6/image/upload/v1748397728/456a769b-c221-4f28-a553-7300cf44c00e_au0sw8.jpg')`
        }}
      ></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-purple-900/50 to-black/80"></div>
      
      {/* Top section with main title */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Aluguel de <span className="gradient-text">Limousines</span>
          </h1>
        </div>
      </div>

      {/* Central content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-pink-200 mb-8 max-w-2xl mx-auto">
            Transforme seus momentos especiais em experiências inesquecíveis
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleWhatsAppClick}
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
            >
              <Phone className="mr-2" size={20} />
              Solicitar Orçamento
            </Button>
            <Button 
              size="lg" 
              className="!bg-purple-600 !text-white hover:!bg-purple-700 px-8 py-4 text-lg transition-all duration-300"
              onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver Catálogo
            </Button>
          </div>
        </div>
      </div>

      {/* Kids Section - positioned at bottom */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="text-center">
          <button
            onClick={handleKidsClick}
            className="group text-5xl md:text-7xl font-bold text-white hover:text-purple-300 transition-colors duration-300"
          >
            Espaço <span className="gradient-text group-hover:text-pink-300">Kids</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
