
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import TherapistCard from '@/components/TherapistCard';
import { useTherapists } from '@/hooks/useTherapists';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Clock, Star } from 'lucide-react';
import ChatTestPanel from '@/components/chat/ChatTestPanel';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { data: therapists = [], isLoading, error } = useTherapists();
  const { user } = useAuth();

  console.log('Index - Component state:', {
    therapistsCount: therapists.length,
    isLoading,
    hasError: !!error,
    firstTherapist: therapists[0]?.name || null
  });

  if (error) {
    console.error('Index - Error loading therapists:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Debug Panel - Mostrar apenas para usuários logados */}
      {user && (
        <section className="py-4 px-4 sm:px-6 lg:px-8 bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto">
            <ChatTestPanel />
          </div>
        </section>
      )}
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Encontre o terapeuta ideal<br />para você
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 animate-fade-in">
              Conectamos você com profissionais qualificados para cuidar da sua saúde mental
            </p>
            
            {/* Search Bar - Always visible as public feature */}
            <div className="max-w-4xl mx-auto animate-fade-in">
              <SearchBar isHomePage={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher a Sequentia?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Oferecemos uma plataforma segura e confiável para conectar você aos melhores profissionais
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center hover-scale">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Profissionais Verificados</h3>
              <p className="text-gray-600">Todos os terapeutas são verificados e possuem credenciais válidas</p>
            </div>

            <div className="text-center hover-scale">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Agendamento Fácil</h3>
              <p className="text-gray-600">Agende sua consulta em poucos cliques, no horário que funciona para você</p>
            </div>

            <div className="text-center hover-scale">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Cuidado Personalizado</h3>
              <p className="text-gray-600">Encontre o profissional que melhor se adequa às suas necessidades</p>
            </div>

            <div className="text-center hover-scale">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Avaliações Reais</h3>
              <p className="text-gray-600">Leia avaliações de outros pacientes para fazer a melhor escolha</p>
            </div>
          </div>
        </div>
      </section>

      {/* Therapists Section - Always show, independent of auth status */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Terapeutas em Destaque
            </h2>
            <p className="text-lg text-gray-600">
              Conheça alguns dos nossos profissionais mais bem avaliados
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">
                <div className="grid gap-6 mb-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Erro ao carregar terapeutas. Tente novamente mais tarde.</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Tentar Novamente
              </Button>
            </div>
          ) : therapists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Nenhum terapeuta cadastrado ainda.</p>
              <Link to="/para-terapeutas">
                <Button variant="outline">
                  Seja um Terapeuta
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 mb-8">
              {therapists.slice(0, 3).map((therapist) => (
                <div key={therapist.id} className="animate-fade-in">
                  <TherapistCard therapist={therapist} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/encontrar-terapeutas">
              <Button size="lg" className="bg-primary hover:bg-primary/90 hover-scale">
                Ver Todos os Terapeutas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Comece sua jornada de bem-estar hoje
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Milhares de pessoas já encontraram ajuda através da nossa plataforma
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/encontrar-terapeutas">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 hover-scale">
                Encontrar Terapeuta
              </Button>
            </Link>
            <Link to="/para-terapeutas">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary hover-scale">
                Sou Terapeuta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">Sequentia</div>
              <p className="text-gray-400">
                Conectando você aos melhores profissionais de saúde mental.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Para Pacientes</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/encontrar-terapeutas" className="hover:text-white story-link">Encontrar Terapeuta</Link></li>
                <li><Link to="/como-funciona" className="hover:text-white story-link">Como Funciona</Link></li>
                <li><a href="#" className="hover:text-white story-link">Preços</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Para Terapeutas</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/para-terapeutas" className="hover:text-white story-link">Cadastre-se</Link></li>
                <li><Link to="/para-terapeutas" className="hover:text-white story-link">Como Funciona</Link></li>
                <li><a href="#" className="hover:text-white story-link">Suporte</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white story-link">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white story-link">Contato</a></li>
                <li><a href="#" className="hover:text-white story-link">Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Sequentia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
