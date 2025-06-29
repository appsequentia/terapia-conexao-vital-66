
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Download, CreditCard } from 'lucide-react';
import { useTherapistStats } from '@/hooks/useTherapistStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FinancialSummary = () => {
  const { data: stats, isLoading } = useTherapistStats();

  // Dados mockados para o gráfico - em um caso real, viriam de uma API
  const monthlyData = [
    { month: 'Jan', revenue: 2400 },
    { month: 'Fev', revenue: 1800 },
    { month: 'Mar', revenue: 3200 },
    { month: 'Abr', revenue: 2800 },
    { month: 'Mai', revenue: 3600 },
    { month: 'Jun', revenue: stats?.monthlyRevenue || 0 },
  ];

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Resumo Financeiro
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Relatório
            </Button>
            <Button size="sm" variant="outline">
              <CreditCard className="w-4 h-4 mr-2" />
              Solicitar Saque
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Receita Total</p>
                <p className="text-2xl font-bold text-green-700">
                  R$ {stats?.monthlyRevenue || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-green-600 mt-2">
              {stats?.monthSessions || 0} sessões este mês
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Saldo Disponível</p>
                <p className="text-2xl font-bold text-blue-700">
                  R$ {((stats?.monthlyRevenue || 0) * 0.85).toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Taxa da plataforma: 15%
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Média por Sessão</p>
                <p className="text-2xl font-bold text-purple-700">
                  R$ {stats?.monthSessions ? Math.round((stats.monthlyRevenue || 0) / stats.monthSessions) : 0}
                </p>
              </div>
              <Badge className="bg-purple-100 text-purple-700">
                Mensal
              </Badge>
            </div>
          </div>
        </div>

        <div className="h-64">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Faturamento dos Últimos 6 Meses</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`R$ ${value}`, 'Receita']}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialSummary;
