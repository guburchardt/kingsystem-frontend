import { useParams, useNavigate } from 'react-router-dom';
import Header from '../site-components/Header';
import Footer from '../site-components/Footer';
import { Button } from '../site-components/ui/button';
import { Card, CardContent } from '../site-components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../site-components/ui/carousel';
import { Users, Phone, Star, ArrowLeft, Check } from 'lucide-react';

const LimousineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const limousines = [
    {
      id: 1,
      name: "300C Crysler",
      capacity: "6 pessoas",
      images: [
        "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/300C/IMG_5121.jpg",
        "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/300C/IMG_5122.jpg",
        "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/300C/IMG_5123.jpg",
        "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/300C/IMG_5124.jpg",
        "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/300C/IMG_5125.jpg",
        "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/300C/IMG_5126.jpg",
        "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/300C/IMG_5127.jpg",
        "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/300C/IMG_5128.jpg",
        "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/300C/IMG_5129.jpg",
        "https://kinglimousinessystem2.s3.us-east-1.amazonaws.com/limousines/300C/IMG_5207.jpg",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748390546/Screenshot_from_2025-05-27_20-59-32_shftii.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748390546/Screenshot_from_2025-05-27_21-00-35_qm07h2.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748390546/Screenshot_from_2025-05-27_21-00-21_uzmd3k.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748390547/Screenshot_from_2025-05-27_21-01-07_uukzoq.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748390546/Screenshot_from_2025-05-27_21-00-50_vbrqfc.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748390546/Screenshot_from_2025-05-27_21-01-01_fbt4hp.png",
      ],
      features: ["Luzes", "Som premium", "Cooler", "Ar condicionado", "Poltronas em couro"],
      description: "Elegância clássica para seus eventos especiais",
      rating: 5.0,
      fullDescription: "Limo importada dos 🇺🇸, Luxuosa ideal para Casamento, 15 Anos, passeios executivos.",
      amenities: ["Champagne", "Água gelada", "Mini refrigerante", "Sistema de climatização individual"]
    },
    {
      id: 2,
      name: "Nossa Gigante",
      capacity: "28 pessoas",
      images: [
        "https://res.cloudinary.com/dcnowyew6/image/upload/c_pad,b_gen_fill,ar_4:3/v1748392884/Screenshot_from_2025-05-27_21-15-56_wakhxq.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/c_pad,b_gen_fill,ar_4:3/v1748391493/Screenshot_from_2025-05-27_21-16-00_tabp9b.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748391498/Screenshot_from_2025-05-27_21-16-33_zocwxq.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748391498/Screenshot_from_2025-05-27_21-16-44_rotxmx.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748391494/Screenshot_from_2025-05-27_21-16-12_aw58u3.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748391501/Screenshot_from_2025-05-27_21-16-55_mftkph.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748391494/Screenshot_from_2025-05-27_21-16-19_rfcaq8.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748391496/Screenshot_from_2025-05-27_21-16-26_mjtyhq.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748391493/Screenshot_from_2025-05-27_21-16-06_hcywzx.png",
      ],
      features: ["Luzes", "Som premium", "Cooler", "Ar Condicionado", "Poltronas em couro", "Teto solar"],
      description: "Luxo e conforto para grupos maiores",
      rating: 5.0,
      fullDescription: "A maior da América Latina 5º maior do mundo",
      amenities: ["Champagne", "Água gelada", "Mini refrigerante", "Sistema de climatização individual"]
    },
    {
      id: 3,
      name: "Pt Crysler",
      capacity: "9 pessoas",
      images: [
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393481/Screenshot_from_2025-05-27_21-49-31_k1vyxi.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393483/Screenshot_from_2025-05-27_21-49-34_otxdhu.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393478/Screenshot_from_2025-05-27_21-49-15_kmlgve.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393479/Screenshot_from_2025-05-27_21-49-21_xd52jn.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393474/Screenshot_from_2025-05-27_21-48-58_jiczl8.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393484/Screenshot_from_2025-05-27_21-49-42_sgruu5.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393487/Screenshot_from_2025-05-27_21-49-44_r4dgin.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393491/Screenshot_from_2025-05-27_21-49-51_gzql7n.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393499/Screenshot_from_2025-05-27_21-50-14_pu5fel.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393500/Screenshot_from_2025-05-27_21-50-16_qja6ef.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393493/Screenshot_from_2025-05-27_21-50-06_gpdxsj.png"
      ],
      features: ["Luzes", "Som premium", "Cooler", "Ar Condicionado", "Poltronas em couro", "Teto solar"],
      description: "A escolha perfeita para festas e celebrações",
      rating: 5.0,
      fullDescription: "Limousine da Barbie",
      amenities: ["Champagne", "Água gelada", "Mini refrigerante", "Sistema de climatização individual"]
    },
    {
      id: 4,
      name: "Black",
      capacity: "15 pessoas",
      images: [
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394063/Screenshot_from_2025-05-27_21-56-48_qleehm.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394447/Screenshot_from_2025-05-27_21-57-18_xltraf_57e5d7.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394063/Screenshot_from_2025-05-27_21-58-22_r2mgk9.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394063/Screenshot_from_2025-05-27_21-58-34_laj8sc.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394503/Screenshot_from_2025-05-27_21-57-24_prko93_183d86.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394064/Screenshot_from_2025-05-27_21-58-42_iv5isv.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394064/Screenshot_from_2025-05-27_21-58-59_v1ywt2.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394063/Screenshot_from_2025-05-27_21-57-34_hrljik.png",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394648/387df8c1-899d-4b91-b44c-2cb0f5d8a295_ksbqgy_52b99e.jpg",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394701/fc143c23-a498-4818-b53b-c857f6d58c74_fixrty.jpg",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394700/c83c2e13-a43f-448a-8bb4-153493ddcaa7_mdkr41.jpg",
        "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394063/Screenshot_from_2025-05-27_21-58-47_sbnnur.png"
      ],
      features: ["Luzes", "Som premium", "Cooler", "Ar Condicionado", "Poltronas em couro", "Teto solar"],
      description: "O máximo em luxo e sofisticação",
      rating: 5.0,
      fullDescription: "A Limousine das estrelas",
      amenities: ["Champagne", "Água gelada", "Mini refrigerante", "Sistema de climatização individual"]
    }
  ];

  const limousine = limousines.find(limo => limo.id === parseInt(id || ''));

  if (!limousine) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Limousine não encontrada</h1>
          <Button onClick={() => navigate('/catalogo')}>Voltar ao Catálogo</Button>
        </div>
      </div>
    );
  }

  const handleWhatsAppClick = () => {
    navigate('/contato');
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <section className="pt-24 pb-20 gradient-purple">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            onClick={() => navigate('/catalogo')}
            variant="ghost"
            className="text-white hover:text-purple-300 mb-6"
          >
            <ArrowLeft className="mr-2" size={20} />
            Voltar ao Catálogo
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Carousel de Imagens */}
            <div className="space-y-6">
              <Carousel className="w-full">
                <CarouselContent>
                  {limousine.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <Card className="border-0">
                        <CardContent className="p-0">
                          <img
                            src={image}
                            alt={`${limousine.name} - Foto ${index + 1}`}
                            className="w-full h-96 object-cover rounded-lg"
                          />
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>

            {/* Informações Detalhadas */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {limousine.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center bg-purple-600 text-white px-3 py-1 rounded-full">
                    <Users size={16} className="mr-1" />
                    {limousine.capacity}
                  </div>
                  <div className="flex items-center bg-black/70 text-white px-3 py-1 rounded-full">
                    <Star size={16} className="mr-1 text-yellow-400" />
                    {limousine.rating}
                  </div>
                </div>
                <p className="text-xl text-gray-200 mb-6">{limousine.description}</p>
                <p className="text-gray-300 leading-relaxed">{limousine.fullDescription}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800/50 border-purple-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Recursos Inclusos</h3>
                    <ul className="space-y-2">
                      {limousine.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-300">
                          <Check size={16} className="text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-purple-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Serviços Adicionais</h3>
                    <ul className="space-y-2">
                      {limousine.amenities.map((amenity, index) => (
                        <li key={index} className="flex items-center text-gray-300">
                          <Check size={16} className="text-green-500 mr-2" />
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={handleWhatsAppClick}
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                size="lg"
              >
                <Phone size={20} className="mr-2" />
                Solicitar Orçamento Agora
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LimousineDetails;
