
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, CreditCard, QrCode, FileText, Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'credit-card',
    name: 'Cartão de Crédito',
    icon: <CreditCard className="h-6 w-6" />,
    description: 'Débito imediato no cartão'
  },
  {
    id: 'pix',
    name: 'PIX',
    icon: <QrCode className="h-6 w-6" />,
    description: 'Pagamento instantâneo'
  },
  {
    id: 'boleto',
    name: 'Boleto',
    icon: <FileText className="h-6 w-6" />,
    description: 'Vencimento em até 3 dias'
  }
];

const PaymentMethodPage = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: async () => {
      if (!appointmentId) throw new Error('ID do agendamento não fornecido');
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          therapist:terapeutas(nome, price_per_session)
        `)
        .eq('id', appointmentId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!appointmentId,
  });

  const handleContinue = () => {
    if (!selectedMethod || !appointmentId) return;
    navigate(`/checkout/${appointmentId}/${selectedMethod}`);
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Valor a combinar';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                Agendamento não encontrado.
              </p>
              <Button onClick={() => navigate('/')}>
                Voltar ao Início
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <h1 className="text-2xl font-bold mb-2">Método de Pagamento</h1>
          <p className="text-muted-foreground">
            Escolha como deseja pagar pela sua consulta
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resumo do Agendamento */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Agendamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{appointment.therapist?.nome}</p>
                  <p className="text-sm text-muted-foreground">Terapeuta</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{formatDate(appointment.appointment_date)}</p>
                  <p className="text-sm text-muted-foreground">Data da consulta</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{appointment.start_time}</p>
                  <p className="text-sm text-muted-foreground">Horário</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(appointment.therapist?.price_per_session)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métodos de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle>Escolha o Método de Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      selectedMethod === method.id ? 'bg-primary text-white' : 'bg-gray-100'
                    }`}>
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{method.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedMethod === method.id
                        ? 'bg-primary border-primary'
                        : 'border-gray-300'
                    }`}>
                      {selectedMethod === method.id && (
                        <div className="w-full h-full bg-white rounded-full scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <Button
                onClick={handleContinue}
                className="w-full mt-6"
                disabled={!selectedMethod}
              >
                Continuar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPage;
