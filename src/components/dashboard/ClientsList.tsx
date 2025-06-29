
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Search, MessageCircle, Calendar, MoreHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ClientData {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  lastAppointment?: string;
  totalSessions: number;
  status: 'active' | 'inactive';
}

const ClientsList = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: clients, isLoading } = useQuery({
    queryKey: ['therapist-clients', user?.id],
    queryFn: async (): Promise<ClientData[]> => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Fetching clients for therapist:', user.id);

      // Primeiro, buscar os agendamentos
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('client_id, appointment_date')
        .eq('therapist_id', user.id)
        .order('appointment_date', { ascending: false });

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
        throw appointmentsError;
      }

      if (!appointments || appointments.length === 0) {
        return [];
      }

      // Obter IDs únicos dos clientes
      const clientIds = [...new Set(appointments.map(apt => apt.client_id))];

      // Buscar os perfis dos clientes
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, nome, email, avatar_url')
        .in('id', clientIds);

      if (profilesError) {
        console.error('Error fetching client profiles:', profilesError);
        throw profilesError;
      }

      // Processar dados para obter informações únicas dos clientes
      const clientsMap = new Map<string, ClientData>();

      appointments.forEach(appointment => {
        const clientId = appointment.client_id;
        const profile = profiles?.find(p => p.id === clientId);

        if (!clientsMap.has(clientId) && profile) {
          clientsMap.set(clientId, {
            id: clientId,
            name: profile.nome || 'Nome não disponível',
            email: profile.email || 'Email não disponível',
            avatar_url: profile.avatar_url,
            lastAppointment: appointment.appointment_date,
            totalSessions: 1,
            status: 'active' as const,
          });
        } else if (clientsMap.has(clientId)) {
          const client = clientsMap.get(clientId)!;
          client.totalSessions += 1;
          // Manter a data mais recente
          if (appointment.appointment_date > (client.lastAppointment || '')) {
            client.lastAppointment = appointment.appointment_date;
          }
        }
      });

      return Array.from(clientsMap.values());
    },
    enabled: !!user?.id,
  });

  const filteredClients = clients?.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Lista de Pacientes
          </CardTitle>
          <Badge variant="secondary">
            {filteredClients.length} pacientes
          </Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredClients.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {client.totalSessions} sessões
                      </Badge>
                      {client.lastAppointment && (
                        <span className="text-xs text-gray-400">
                          Última: {new Date(client.lastAppointment).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum paciente encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientsList;
