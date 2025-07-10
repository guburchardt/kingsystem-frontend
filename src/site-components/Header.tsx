import { useState } from 'react';
import { Menu, X, Phone, Instagram, Facebook } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleWhatsAppClick = () => {
    window.location.href = '/contato';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-500/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex-shrink-0">
            <img src="/king.svg" alt="King Limousines Logo" className="h-24 w-auto max-h-[6rem]" />
          </div>
          
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="/" className="text-white hover:text-purple-400 transition-colors">Início</a>
              <a href="/catalogo" className="text-white hover:text-purple-400 transition-colors">Catálogo</a>
              <a href="/kids" className="text-white hover:text-purple-400 transition-colors">Kids</a>
              <a href="/galeria" className="text-white hover:text-purple-400 transition-colors">Galeria</a>
              <a href="/depoimentos" className="text-white hover:text-purple-400 transition-colors">Depoimentos</a>
              <a href="/contato" className="text-white hover:text-purple-400 transition-colors">Contato</a>
            </div>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <a href="https://www.instagram.com/kinglimousines/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://www.facebook.com/kinglimousines/?locale=pt_BR" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400 transition-colors">
              <Facebook size={20} />
            </a>
            <Button onClick={handleWhatsAppClick} className="bg-green-600 hover:bg-green-700">
              <Phone size={16} className="mr-2" />
              WhatsApp
            </Button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-purple-400"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90 rounded-lg mt-2">
              <a href="/" className="block text-white hover:text-purple-400 px-3 py-2">Início</a>
              <a href="/catalogo" className="block text-white hover:text-purple-400 px-3 py-2">Catálogo</a>
              <a href="/kids" className="block text-white hover:text-purple-400 px-3 py-2">Kids</a>
              <a href="/galeria" className="block text-white hover:text-purple-400 px-3 py-2">Galeria</a>
              <a href="/depoimentos" className="block text-white hover:text-purple-400 px-3 py-2">Depoimentos</a>
              <a href="/contato" className="block text-white hover:text-purple-400 px-3 py-2">Contato</a>
              <div className="flex items-center space-x-4 px-3 py-2">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400">
                  <Instagram size={20} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400">
                  <Facebook size={20} />
                </a>
                <Button onClick={handleWhatsAppClick} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Phone size={14} className="mr-1" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
