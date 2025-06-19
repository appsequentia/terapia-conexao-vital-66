
import { useState } from 'react';
import { Search, Menu, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-primary">
              Sequentia
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">
              Encontrar Terapeutas
            </a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">
              Como Funciona
            </a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">
              Para Terapeutas
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button className="hidden sm:flex">
              Entrar
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-gray-700 hover:text-primary py-2">
                Encontrar Terapeutas
              </a>
              <a href="#" className="text-gray-700 hover:text-primary py-2">
                Como Funciona
              </a>
              <a href="#" className="text-gray-700 hover:text-primary py-2">
                Para Terapeutas
              </a>
              <Button className="mt-4 w-full">
                Entrar
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
