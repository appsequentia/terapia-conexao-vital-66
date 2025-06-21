
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, Calendar, DollarSign, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const ParaTerapeutas = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Conecte-se com mais pacientes
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              Expanda sua prática terapêutica na maior plataforma de saúde mental do Brasil
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-primary hover:text-primary/90"
              asChild
            >
              <Link to="/cadastro">
                Cadastre-se Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher a Sequentia?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos as ferramentas e o suporte necessários para você expandir sua prática
              e impactar mais vidas de forma significativa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Mais Pacientes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Conecte-se com pessoas que precisam da sua ajuda através da nossa plataforma
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Gestão Simplificada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sistema integrado de agendamento, prontuários e gestão financeira
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Renda Extra</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Defina seus próprios valores e horários. Tenha controle total da sua agenda
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Reputação Online</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Construa sua reputação com avaliações e depoimentos de pacientes satisfeitos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recursos exclusivos para terapeutas
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Tudo que você precisa em um só lugar
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Perfil Profissional Completo</h4>
                    <p className="text-gray-600">Mostre suas especialidades, formação e experiência</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Agendamento Online</h4>
                    <p className="text-gray-600">Sistema automatizado de marcação de consultas</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Prontuário Digital</h4>
                    <p className="text-gray-600">Mantenha o histórico dos seus pacientes organizado</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Teleconsulta Integrada</h4>
                    <p className="text-gray-600">Atenda seus pacientes online com qualidade</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500">Dashboard Preview</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que nossos terapeutas dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "A plataforma me permitiu organizar melhor minha prática e alcançar mais pacientes. 
                  O sistema de agendamento é excelente!"
                </p>
                <div className="font-semibold text-gray-900">Ana Silva</div>
                <div className="text-sm text-gray-500">Psicóloga Clínica</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Consegui dobrar minha base de pacientes em 6 meses. A qualidade dos recursos 
                  disponíveis é impressionante."
                </p>
                <div className="font-semibold text-gray-900">Carlos Mendes</div>
                <div className="text-sm text-gray-500">Terapeuta Familiar</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "O suporte técnico é excepcional e a plataforma é muito intuitiva. 
                  Recomendo para qualquer colega terapeuta."
                </p>
                <div className="font-semibold text-gray-900">Maria Santos</div>
                <div className="text-sm text-gray-500">Psicanalista</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para expandir sua prática?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Junte-se a centenas de terapeutas que já transformaram sua carreira conosco
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-primary hover:text-primary/90"
            asChild
          >
            <Link to="/cadastro">
              Começar Agora - É Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParaTerapeutas;
