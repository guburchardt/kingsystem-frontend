import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Users, Phone, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CatalogoSection = () => {
  const navigate = useNavigate();

  const limousines = [
    {
      id: 1,
      name: "300C Crysler",
      capacity: "6 pessoas",
      image: "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/300C/IMG_5124.jpg",
      features: ["Luzes", "Som premium", "Cooler", "Ar condicionado", "Poltronas em couro"],
      description: "Elegância clássica para seus eventos especiais"
    },
    {
      id: 2,
      name: "Nossa Gigante",
      capacity: "28 pessoas",
      image: "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/gigante/IMG_5131.jpg",
      features: ["Luzes", "Som premium", "Cooler", "Ar Condicionado", "Poltronas em couro", "Teto solar"],
      description: "Luxo e conforto para grupos maiores"
    },
    {
      id: 3,
      name: "Pt Crysler",
      capacity: "9 pessoas",
      image: "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/ptrosa/IMG_5153.jpg",
      features: ["Luzes", "Som premium", "Cooler", "Ar Condicionado", "Poltronas em couro", "Teto solar"],
      description: "A escolha perfeita para festas e celebrações"
    },
    {
      id: 4,
      name: "Black",
      capacity: "15 pessoas",
      image: "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/RAM/IMG_5143.jpg",
      features: ["Luzes", "Som premium", "Cooler", "Ar Condicionado", "Poltronas em couro", "Teto solar"],
      description: "O máximo em luxo e sofisticação"
    },
    {
      id: 5,
      name: "Onibus King",
      capacity: "45 pessoas",
      image: "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/onibus/IMG_5108.jpg",
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
                <img 
                  src={limo.image} 
                  alt={limo.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
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
