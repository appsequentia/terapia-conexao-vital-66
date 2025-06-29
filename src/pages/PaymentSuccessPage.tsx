
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Home } from 'lucide-react';
import Header from '@/components/Header';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect após 10 segundos
    const timer = setTimeout(() => {
      navigate('/dashboard-cliente');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-8 pb-6">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-green-600 mb-2">
                Pagamento Confirmado!
              </h1>
              <p className="text-muted-foreground">
                Seu agendamento foi confirmado com sucesso
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Próximos Passos:</h3>
                <ul className="text-sm text-green-700 space-y-1 text-left">
                  <li>• Você receberá um e-mail de confirmação</li>
                  <li>• O terapeuta entrará em contato em breve</li>
                  <li>• Acesse seu dashboard para mais detalhes</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Início
              </Button>
              <Button
                onClick={() => navigate('/dashboard-cliente')}
                className="flex-1"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Meus Agendamentos
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              Redirecionando automaticamente em 10 segundos...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
