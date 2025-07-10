import Header from '../site-components/Header';
import Footer from '../site-components/Footer';
import { Card, CardContent } from '../site-components/ui/card';
import { Star, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Depoimentos = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      id: 1,
      name: "Maria Silva",
      event: "Casamento",
      rating: 5,
      comment: "O serviço foi excepcional! A limousine estava impecável e o motorista foi muito profissional. Nosso casamento ficou ainda mais especial.",
      date: "Janeiro 2024"
    },
    {
      id: 2,
      name: "João Santos",
      event: "Formatura",
      rating: 5,
      comment: "Experiência incrível! Alugamos para a formatura da minha filha e foi perfeito. Todos os amigos ficaram impressionados.",
      date: "Dezembro 2023"
    },
    {
      id: 3,
      name: "Ana Costa",
      event: "Aniversário de 15 anos",
      rating: 5,
      comment: "A festa dos 15 anos da minha filha ficou inesquecível. A limousine era linda e tinha tudo que precisávamos para uma noite perfeita.",
      date: "Novembro 2023"
    },
    {
      id: 4,
      name: "Carlos Oliveira",
      event: "Evento corporativo",
      rating: 5,
      comment: "Contratamos para um evento da empresa e superou todas as expectativas. Pontualidade, elegância e profissionalismo impecáveis.",
      date: "Outubro 2023"
    },
    {
      id: 5,
      name: "Fernanda Lima",
      event: "Despedida de solteira",
      rating: 5,
      comment: "Que experiência maravilhosa! A despedida de solteira ficou perfeita com a limousine. Todas as amigas amaram!",
      date: "Setembro 2023"
    },
    {
      id: 6,
      name: "Roberto Mendes",
      event: "Bodas de ouro",
      rating: 5,
      comment: "Comemoramos 50 anos de casamento com muito estilo. O atendimento foi excepcional desde o primeiro contato.",
      date: "Agosto 2023"
    }
  ];

  const stats = [
    { number: "500+", label: "Eventos Realizados" },
    { number: "5.0", label: "Avaliação Média" },
    { number: "100%", label: "Clientes Satisfeitos" },
    { number: "10+", label: "Anos de Experiência" }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <section className="pt-32 pb-12 gradient-purple">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Depoimentos de <span className="gradient-text">Clientes</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Veja o que nossos clientes falam sobre nossa qualidade e excelência no atendimento
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-gray-800/50 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Quote className="text-purple-400" size={32} />
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="text-yellow-400 fill-current" size={20} />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 italic">"{testimonial.comment}"</p>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-purple-400 text-sm">{testimonial.event}</div>
                    <div className="text-gray-400 text-xs mt-1">{testimonial.date}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 gradient-purple">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para Sua <span className="gradient-text">Experiência VIP?</span>
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Junte-se aos nossos clientes satisfeitos e transforme seu evento em um momento inesquecível
          </p>
          <button
            onClick={() => navigate('/contato')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            Solicitar Orçamento Agora
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Depoimentos;
