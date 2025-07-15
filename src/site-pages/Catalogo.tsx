import Header from '../site-components/Header';
import Footer from '../site-components/Footer';
import { Button } from '../site-components/ui/button';
import { Card, CardContent } from '../site-components/ui/card';
import { Users, Phone, Star, Clock, Shield, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Catalogo = () => {
  const navigate = useNavigate();

  const limousines = [
    {
      id: 1,
      name: "300C Crysler",
      capacity: "6 pessoas",
      image: "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/300C/IMG_5121.jpg",
      features: ["Luzes", "Som premium", "Cooler", "Ar condicionado", "Poltronas em couro"],
      description: "Elegância clássica para seus eventos especiais",
      rating: 5.0,
    },
    {
      id: 2,
      name: "Nossa Gigante",
      capacity: "28 pessoas",
      image: "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/gigante/IMG_5130.jpg",
      features: ["Luzes", "Som premium", "Cooler", "Ar Condicionado", "Poltronas em couro", "Teto solar"],
      description: "Luxo e conforto para grupos maiores",
      rating: 5.0,
    },
    {
      id: 3,
      name: "Pt Crysler",
      capacity: "9 pessoas",
      image: "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/ptrosa/IMG_5151.jpg",
      features: ["Luzes", "Som premium", "Cooler", "Ar Condicionado", "Poltronas em couro", "Teto solar"],
      description: "A escolha perfeita para festas e celebrações",
      rating: 5.0,
    },
    {
      id: 4,
      name: "Black",
      capacity: "15 pessoas",
      image: "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/RAM/IMG_5142.png",
      features: ["Luzes", "Som premium", "Cooler", "Ar Condicionado", "Poltronas em couro", "Teto solar"],
      description: "O máximo em luxo e sofisticação",
      rating: 5.0,
    },
    {
      id: 5,
      name: "Onibus King",
      capacity: "45 pessoas",
      image: "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/onibus/IMG_5109.jpg",
      features: ["Luzes", "Som premium", "Cooler", "Ar Condicionado", "Poltronas em couro", "Teto solar", "Wi-Fi", "Tomadas USB"],
      description: "O ônibus festa mais incrível para suas celebrações especiais",
      rating: 5.0,
    }
  ];

  const handleWhatsAppClick = () => {
    navigate('/contato');
  };

  const handleViewDetails = (id: number) => {
    navigate(`/limousine/${id}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <section className="pt-32 pb-12 gradient-purple">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Catálogo <span className="gradient-text">Premium</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Descubra nossa frota exclusiva de limousines de luxo. Cada veículo é meticulosamente mantido 
              e equipado com os melhores recursos para garantir uma experiência inesquecível.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <Shield className="mx-auto mb-4 text-purple-400" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">Segurança Garantida</h3>
              <p className="text-gray-300">Motoristas experientes e veículos revisados</p>
            </div>
            <div className="text-center">
              <Clock className="mx-auto mb-4 text-purple-400" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">Pontualidade</h3>
              <p className="text-gray-300">Sempre no horário, sem atrasos</p>
            </div>
            <div className="text-center">
              <Star className="mx-auto mb-4 text-purple-400" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">Excelência</h3>
              <p className="text-gray-300">Serviço premium e atendimento 5 estrelas</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {limousines.map((limo) => (
              <Card key={limo.id} className="bg-gray-800/50 border-purple-500/20 overflow-hidden hover:border-purple-500/50 transition-all duration-300">
                <div className="md:flex">
                  <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                    <img 
                      src={`${limo.image}?v=${Date.now()}`} 
                      alt={limo.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full flex items-center">
                      <Users size={16} className="mr-1" />
                      {limo.capacity}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full flex items-center">
                      <Star size={16} className="mr-1 text-yellow-400" />
                      {limo.rating}
                    </div>
                  </div>
                  
                  <CardContent className="md:w-1/2 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{limo.name}</h3>
                    <p className="text-gray-300 mb-3">{limo.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-purple-400 mb-2">RECURSOS INCLUSOS:</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
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
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Catalogo;
