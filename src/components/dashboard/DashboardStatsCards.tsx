
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, DollarSign, Clock } from 'lucide-react';
import { useTherapistStats } from '@/hooks/useTherapistStats';

const DashboardStatsCards = () => {
  const { data: stats, isLoading } = useTherapistStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: 'Sessões Hoje',
      value: stats?.todaySessions || 0,
      description: `R$ ${stats?.todayRevenue || 0} em receita`,
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      title: 'Pacientes Ativos',
      value: stats?.activeClients || 0,
      description: `${stats?.newClientsThisMonth || 0} novos este mês`,
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Receita do Mês',
      value: `R$ ${stats?.monthlyRevenue || 0}`,
      description: `${stats?.monthSessions || 0} sessões realizadas`,
      icon: DollarSign,
      color: 'text-emerald-600',
    },
    {
      title: 'Agendamentos Pendentes',
      value: stats?.pendingAppointments || 0,
      description: 'Aguardando confirmação',
      icon: Clock,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStatsCards;
