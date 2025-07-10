import Header from '../site-components/Header';
import Footer from '../site-components/Footer';
import { Card, CardContent } from '../site-components/ui/card';
import { Button } from '../site-components/ui/button';
import { Star, Heart, Shield, Users, Phone } from 'lucide-react';

const Kids = () => {
  const handleWhatsAppClick = () => {
    window.location.href = '/contato';
  };

  const features = [
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Ambiente 100% seguro com supervisão especializada e equipamentos de proteção."
    },
    {
      icon: Heart,
      title: "Diversão Garantida",
      description: "Muitas atividades e brinquedos para crianças se divertirem"
    },
    {
      icon: Users,
      title: "Equipe Especializada",
      description: "Profissionais especializados para cuidar das crianças"
    },
    {
      icon: Star,
      title: "Experiência Única",
      description: "Momentos especiais que as crianças vão lembrar para sempre."
    }
  ];

  const galleryImages = [
    {
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748450435/2a48c853-a844-41a8-b7f9-8ef940ff0318_vn0bjx.jpg",
      alt: "Espaco Kids com infraestrutura completa"
    },
    {
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748565154/7f21628a-de9d-4bc9-aa36-b8ce181577ee_gmekym.jpg",
      alt: "Pista de dança"
    },
    {
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748565154/7f21628a-de9d-4bc9-aa36-b8ce181577ee_gmekym.jpg",
      alt: "Pista de dança com jogos"
    },
    {
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748565154/3342e93c-b697-4a58-a679-c10dc3d14dc7_wiitau.jpg",
      alt: "Momento de diversão"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <section className="pt-32 pb-12 gradient-purple">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Espaço <span className="gradient-text">Kids</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Um ambiente mágico e seguro onde as crianças podem se divertir enquanto os adultos aproveitam momentos especiais
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Diversão e Segurança em <span className="gradient-text">Primeiro Lugar</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Nosso Espaço Kids foi especialmente desenvolvido para proporcionar momentos inesquecíveis 
                para as crianças durante eventos especiais. Ambiente 
                totalmente seguro, onde os pais podem relaxar sabendo que seus filhos estão se divertindo.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
                  <span className="text-gray-300">Nosso espaço tem 220 metros quadrados</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
                  <span className="text-gray-300">Um topogã gigante de 5 metros</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
                  <span className="text-gray-300">Um topogã de 3 metros com piscina de bolinhas </span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
                  <span className="text-gray-300">Um circuito de 8 metros com escorregador e piscina de bolinhas</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
                  <span className="text-gray-300">Cama elástica grande</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
                  <span className="text-gray-300">Vídeo game</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
                  <span className="text-gray-300">Um super Robô com batalha de dança ( as crianças adoram 😍)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
                  <span className="text-gray-300">Air Game 🕹️</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
                  <span className="text-gray-300">Camarim</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
                  <span className="text-gray-300">Máquina de fumaça</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
                  <span className="text-gray-300">Pista de dança</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
                  <span className="text-gray-300">Caixa de som bem potente</span>
                </div>  
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.map((image, index) => (
                <img
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Nossos <span className="gradient-text">Diferenciais</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              O que torna nosso Espaço Kids único e especial para seus filhos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800/50 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 gradient-purple">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Agende uma <span className="gradient-text">Visita</span>
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Venha conhecer nosso Espaço Kids e veja como podemos tornar seu evento ainda mais especial para toda a família
          </p>
          <Button
            onClick={handleWhatsAppClick}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
          >
            <Phone className="mr-2" size={20} />
            Agendar Visita
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Kids;
