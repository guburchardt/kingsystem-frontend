
import Header from '../site-components/Header';
import Footer from '../site-components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../site-components/ui/card';
import { Button } from '../site-components/ui/button';
import { Input } from '../site-components/ui/input';
import { Textarea } from '../site-components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../site-components/ui/select';
import { Phone, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { config } from '../config/env';

const Contato = () => {
  const lojistas = [
    { nome: "Roberta", numero: "51992115755" },
    { nome: "Dani", numero: "54992606230" },
    { nome: "Marcia", numero: "5199458-8975" },
    { nome: "Ivan", numero: "51999999180" }
  ];

  const handleWhatsAppClick = (numero: string, nome: string) => {
    const numeroLimpo = numero.replace(/\D/g, '');
    window.open(`https://wa.me/55${numeroLimpo}?text=Olá ${nome}! Gostaria de solicitar um orçamento para aluguel de limousine.`, '_blank');
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Preparar dados para enviar ao backend
    const emailData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      city: formData.get('city') as string,
      contact_method: formData.get('contact_method') as string,
      message: formData.get('message') as string,
      status: 'pendente'
    };

    try {
      // Enviar para o backend
      const response = await fetch(`${config.API_URL}/emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        // Sucesso - mostrar mensagem e limpar formulário
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        (e.target as HTMLFormElement).reset();
      } else {
        // Erro
        alert('Erro ao enviar mensagem. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <section className="pt-32 pb-12 gradient-purple">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Entre em <span className="gradient-text">Contato</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Nossos especialistas estão prontos para atender você e realizar o orçamento da limousine dos seus sonhos
            </p>
          </div>
        </div>
      </section>

      {/* Lojistas - Primeira seção */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nossos <span className="gradient-text">Lojistas</span>
            </h2>
            <p className="text-lg text-gray-300">
              Entre em contato diretamente via WhatsApp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {lojistas.map((lojista, index) => (
              <Card key={index} className="bg-gray-800/50 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{lojista.nome}</h3>
                  <p className="text-gray-300 mb-4">{lojista.numero}</p>
                  <Button
                    onClick={() => handleWhatsAppClick(lojista.numero, lojista.nome)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Phone className="mr-2" size={16} />
                    Chamar no WhatsApp
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Formulário - Segunda seção */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gray-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white text-center">
                  Solicite seu Orçamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <Input
                      type="text"
                      name="name"
                      required
                      placeholder="Nome completo"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Select name="contact_method" required>
                      <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                        <SelectValue placeholder="Selecione a forma de contato" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="Telefone" className="text-white hover:bg-gray-700">Telefone</SelectItem>
                        <SelectItem value="Whatsapp" className="text-white hover:bg-gray-700">WhatsApp</SelectItem>
                        <SelectItem value="Email" className="text-white hover:bg-gray-700">E-mail</SelectItem>
                        <SelectItem value="Outros" className="text-white hover:bg-gray-700">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="(99) 99999-9999"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="seu@email.com"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      name="city"
                      placeholder="Cidade"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Textarea
                      name="message"
                      placeholder="Sua mensagem"
                      rows={4}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Send className="mr-2" size={16} />
                    Enviar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-purple-500/20">
              <CardContent className="p-6 text-center">
                <MapPin className="text-purple-500 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-white mb-3">Localização</h3>
                <p className="text-gray-300">
                  Atendemos em todo o Rio Grande do Sul com frota especializada
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-purple-500/20">
              <CardContent className="p-6 text-center">
                <Clock className="text-purple-500 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-white mb-3">Horário</h3>
                <p className="text-gray-300">
                  Atendimento 24h para emergências<br />
                  Seg-Dom: 08:00 às 22:00
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-purple-500/20">
              <CardContent className="p-6 text-center">
                <Phone className="text-purple-500 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-white mb-3">WhatsApp</h3>
                <p className="text-gray-300">
                  Resposta rápida e orçamento personalizado para seu evento
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contato;
