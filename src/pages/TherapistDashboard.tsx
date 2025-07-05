
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User, Calendar, Users, DollarSign, Bell, Clock } from 'lucide-react';
import { getPersonalizedGreeting } from '@/utils/greetingUtils';
import { useNavigate } from 'react-router-dom';
import { useTherapistProfileCheck } from '@/hooks/useTherapistProfileCheck';
import DashboardStatsCards from '@/components/dashboard/DashboardStatsCards';
import TherapistCalendar from '@/components/dashboard/TherapistCalendar';
import ClientsList from '@/components/dashboard/ClientsList';
import FinancialSummary from '@/components/dashboard/FinancialSummary';
import AvailabilityManager from '@/components/availability/AvailabilityManager';
import { EventManager } from '@/components/availability/EventManager';
import TherapistNextSessionCard from '@/components/dashboard/TherapistNextSessionCard';
import { useToast } from '@/hooks/use-toast';

const TherapistDashboard = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('agenda');
  
  // This hook automatically handles redirection if profile is incomplete
  useTherapistProfileCheck();

  const handleLogout = async () => {
    try {
      console.log('Dashboard - Logging out...');
      await logout();
    } catch (error) {
      console.error('Dashboard - Erro ao fazer logout:', error);
    }
  };

  const handleEditProfile = () => {
    console.log('TherapistDashboard - Edit profile button clicked');
    console.log('TherapistDashboard - Current profile:', {
      hasProfile: !!profile,
      userType: profile?.tipo_usuario,
      profileId: profile?.id
    });
    
    try {
      console.log('TherapistDashboard - Navigating to /editar-perfil-terapeuta');
      navigate('/editar-perfil-terapeuta');
      console.log('TherapistDashboard - Navigation completed');
    } catch (error) {
      console.error('TherapistDashboard - Navigation error:', error);
    }
  };

  const handleManageAvailability = () => {
    setActiveTab('disponibilidade');
  };

  const handleConfigureNotifications = () => {
    toast({
      title: "Configurações de Notificação",
      description: "Esta funcionalidade estará disponível em breve. Você será notificado sobre novos agendamentos e mensagens.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getPersonalizedGreeting(profile?.nome || '', profile?.genero)}
            </h1>
            <p className="mt-2 text-gray-600">
              Gerencie seus pacientes, sessões e perfil profissional.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 hover:border-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="mb-8">
          <DashboardStatsCards />
        </div>

        {/* Card da Próxima Sessão */}
        <div className="mb-8">
          <TherapistNextSessionCard />
        </div>

        {/* Conteúdo Principal com Abas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="agenda" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Agenda</span>
            </TabsTrigger>
            <TabsTrigger value="disponibilidade" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Horários</span>
            </TabsTrigger>
            <TabsTrigger value="pacientes" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Pacientes</span>
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Financeiro</span>
            </TabsTrigger>
            <TabsTrigger value="perfil" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agenda" className="space-y-6">
            <TherapistCalendar />
          </TabsContent>

          <TabsContent value="disponibilidade" className="space-y-6">
            <AvailabilityManager />
            <EventManager />
          </TabsContent>

          <TabsContent value="pacientes" className="space-y-6">
            <ClientsList />
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-6">
            <FinancialSummary />
          </TabsContent>

          <TabsContent value="perfil" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleEditProfile}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Editar Perfil Profissional
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleManageAvailability}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Gerenciar Disponibilidade
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleConfigureNotifications}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Configurar Notificações
                  </Button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Informações do Perfil</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Nome:</span>
                    <p className="text-gray-900">{profile?.nome || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <p className="text-gray-900">{profile?.email || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Tipo de Usuário:</span>
                    <p className="text-gray-900 capitalize">
                      {profile?.tipo_usuario === 'therapist' ? 'Terapeuta' : 'Cliente'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TherapistDashboard;
