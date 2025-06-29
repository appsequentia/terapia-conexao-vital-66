import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Header from '@/components/Header';
import { CheckCircle } from 'lucide-react';

const PaymentSuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-4 md:p-8 flex justify-center">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto bg-green-100 rounded-full h-16 w-16 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl mt-4">Pagamento Realizado com Sucesso!</CardTitle>
            <CardDescription>Sua consulta foi agendada. Você receberá um e-mail com todos os detalhes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Você pode ver os detalhes do seu agendamento no seu painel.
            </p>
            <Button asChild>
              <Link to="/dashboard-cliente">Ir para o Painel</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
