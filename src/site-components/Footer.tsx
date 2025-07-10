import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '../site-components/ui/button';

const Footer = () => {
  const handleWhatsAppClick = () => {
    window.location.href = '/contato';
  };

  return (
    <footer className="bg-black border-t border-purple-500/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img src="/king.svg" alt="King Limousines Logo" className="h-24 w-auto max-h-[6rem] mb-4" />
            <p className="text-gray-300 mb-6 max-w-md">
              Oferecemos o melhor serviço de aluguel de limousines premium para seus momentos especiais. 
              Elegância, conforto e sofisticação em cada viagem.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/kinglimousines/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-purple-600 hover:bg-purple-700 p-2 rounded-full transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://www.facebook.com/kinglimousines/?locale=pt_BR" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-purple-600 hover:bg-purple-700 p-2 rounded-full transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-purple-400 transition-colors">Início</a></li>
              <li><a href="/catalogo" className="text-gray-300 hover:text-purple-400 transition-colors">Catálogo</a></li>
              <li><a href="/kids" className="text-gray-300 hover:text-purple-400 transition-colors">Kids</a></li>
              <li><a href="/galeria" className="text-gray-300 hover:text-purple-400 transition-colors">Galeria</a></li>
              <li><a href="/depoimentos" className="text-gray-300 hover:text-purple-400 transition-colors">Depoimentos</a></li>
              <li><a href="/contato" className="text-gray-300 hover:text-purple-400 transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Phone size={16} className="mr-2" />
                <span>(51) 992115755</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail size={16} className="mr-2" />
                <span>contato@kinglimousines.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin size={16} className="mr-2" />
                <span>Rio Grande do Sul, RS</span>
              </div>
              <Button 
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center mt-4"
              >
                <Phone size={16} className="mr-2" />
                Fale Conosco
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-500/20 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 King Limousines. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
