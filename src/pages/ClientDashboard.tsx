
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, User, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NextSessionCard from '@/components/dashboard/NextSessionCard';
import FutureAppointmentsList from '@/components/dashboard/FutureAppointmentsList';
import SessionHistory from '@/components/dashboard/SessionHistory';
import MessagesWidget from '@/components/dashboard/MessagesWidget';

const ClientDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {profile?.nome}!
          </h1>
          <p className="mt-2 text-gray-600">
            Gerencie suas sessões e encontre o terapeuta ideal para você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NextSessionCard />

          <MessagesWidget />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Meu Terapeuta
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Nenhum terapeuta selecionado
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8 mt-8">
          <FutureAppointmentsList />
          
          <SessionHistory />
          
          <Card>
            <CardHeader>
              <CardTitle>Comece sua jornada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Encontre o terapeuta ideal para suas necessidades e comece sua jornada de bem-estar.
              </p>
              <Button className="w-full sm:w-auto" onClick={() => navigate('/encontrar-terapeutas')}>
                <Search className="w-4 h-4 mr-2" />
                Encontrar Terapeutas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
