import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Users, Phone, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Componente otimizado para imagens
const OptimizedImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Gerar URLs otimizadas
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const optimizedSrc = `${src}?format=webp&quality=85&w=800`;
  const thumbnailSrc = `${src}?quality=10&w=200`;

  return (
    <picture>
      <source srcSet={optimizedSrc} type="image/webp" />
      <img 
        src={thumbnailSrc}
        data-src={optimizedSrc}
        alt={alt}
        loading="lazy"
        className={`${className} transition-all duration-500 ${
          isLoaded ? 'scale-100 blur-0' : 'scale-110 blur-sm'
        }`}
        onLoad={(e) => {
          const target = e.target as HTMLImageElement;
          if (target.dataset.src) {
            target.src = target.dataset.src;
            setIsLoaded(true);
          }
        }}
      />
    </picture>
  );
};

const CatalogoSection = () => {
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const limousines = [
    {
      id: 1,
      name: "300C Crysler",
      capacity: "6 pessoas",
      image: "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/300C/3.png",
      features: ["Luzes", "Som premium", "Cooler", "Ar condicionado", "Poltronas em couro"],
      description: "Elegância clássica para seus eventos especiais"
    },
    {
      id: 2,
      name: "Nossa Gigante",
      capacity: "30 pessoas",
      image: "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/gigante/1.png",
      features: ["Luzes", "Som premium", "Cooler", "Ar Condicionado", "Poltronas em couro", "Teto solar"],
      description: "Luxo e conforto para grupos maiores"
    },
    {
      id: 3,
      name: "Pt Crysler",
      capacity: "10 pessoas",
      image: "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/ptrosa/3.png",
      features: ["Luzes", "Som premium", "Cooler", "Ar Condicionado", "Poltronas em couro", "Teto solar"],
      description: "A escolha perfeita para festas e celebrações"
    },
    {
      id: 4,
      name: "Black",
      capacity: "14 pessoas",
      image: "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/RAM/2.png",
      features: ["Luzes", "Som premium", "Cooler", "Ar Condicionado", "Poltronas em couro", "Teto solar"],
      description: "O máximo em luxo e sofisticação"
    },
    {
      id: 5,
      name: "Onibus King",
      capacity: "22 pessoas",
      image: "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/onibus/1.png",
      features: ["Luzes", "Som premium", "Cooler", "Ar Condicionado", "Poltronas em couro", "Teto solar", "Wi-Fi", "Tomadas USB"],
      description: "O ônibus festa mais incrível para suas celebrações especiais"
    },
  ];

  const handleWhatsAppClick = () => {
    navigate('/contato');
  };

  const handleViewDetails = (id: number) => {
    navigate(`/limousine/${id}`);
  };

  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => new Set([...Array.from(prev), id]));
  };

  return (
    <section id="catalogo" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nossa <span className="gradient-text">Frota Premium</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Escolha entre nossos veículos de luxo, cada um equipado com o que há de melhor em conforto e elegância
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {limousines.map((limo) => (
            <Card key={limo.id} className="bg-gray-800/50 border-purple-500/20 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <div className="relative h-64 overflow-hidden">
                <OptimizedImage 
                  src={limo.image}
                  alt={limo.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full flex items-center">
                  <Users size={16} className="mr-1" />
                  {limo.capacity}
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{limo.name}</h3>
                <p className="text-gray-300 mb-4">{limo.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-purple-400 mb-2">RECURSOS INCLUSOS:</h4>
                  <ul className="grid grid-cols-2 gap-1 text-sm text-gray-300">
                    {limo.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => handleViewDetails(limo.id)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Eye size={16} className="mr-2" />
                    Ver Detalhes
                  </Button>
                  
                  <Button 
                    onClick={handleWhatsAppClick}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Phone size={16} className="mr-2" />
                    Solicitar Orçamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CatalogoSection;
