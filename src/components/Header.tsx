
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Settings } from 'lucide-react';

const Header = () => {
  const {
    isAuthenticated,
    profile,
    logout,
    isLoading
  } = useAuth();
  const navigate = useNavigate();
  
  console.log('Header render - Auth state:', {
    isAuthenticated, 
    isLoading, 
    hasProfile: !!profile,
    profileType: profile?.tipo_usuario
  });

  const handleLogout = async () => {
    try {
      console.log('Header - Logging out...');
      await logout();
    } catch (error) {
      console.error('Header - Erro ao fazer logout:', error);
    }
  };

  const handleLogin = () => {
    console.log('Header - Navigating to login');
    navigate('/login');
  };

  const handleRegister = () => {
    console.log('Header - Navigating to register');
    navigate('/cadastro');
  };

  const getUserInitials = (nome: string) => {
    return nome.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
              Sequentia
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/encontrar-terapeutas" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
              Encontrar Terapeutas
            </Link>
            <Link to="/como-funciona" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
              Como Funciona
            </Link>
            <Link to="/para-terapeutas" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
              Para Terapeutas
            </Link>
          </nav>

          {/* Auth Section - Always render public buttons when not authenticated */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : isAuthenticated && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar_url} alt={profile.nome} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitials(profile.nome)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile.nome}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {profile.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {profile.tipo_usuario === 'client' ? 'Cliente' : 'Terapeuta'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/perfil')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Always show public buttons when not authenticated - no additional conditions */
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={handleLogin} className="text-gray-700 hover:text-primary">
                  Entrar
                </Button>
                <Button onClick={handleRegister} className="bg-primary hover:bg-primary/90 text-gray-50">
                  Cadastrar
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <nav className="flex space-x-4 py-2">
            <Link to="/encontrar-terapeutas" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Terapeutas
            </Link>
            <Link to="/como-funciona" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Como Funciona
            </Link>
            <Link to="/para-terapeutas" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Para Terapeutas
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
