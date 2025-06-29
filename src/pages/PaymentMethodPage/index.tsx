import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Header from '@/components/Header';
import { CreditCard, QrCode, Barcode } from 'lucide-react';

const PaymentMethodPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Em um cenário real, os dados viriam do location.state
  const { appointmentDetails } = location.state || {
    appointmentDetails: {
      therapistName: 'Dr. Exemplo',
      date: new Date(),
      time: '10:00',
      price: 150,
    },
  };

  const [selectedMethod, setSelectedMethod] = useState('credit-card');

  const handleContinue = () => {
    if (selectedMethod === 'credit-card') {
      navigate('/checkout/credit-card', { state: { appointmentDetails } });
    } else {
      // Lógica para PIX ou Boleto (a ser implementada)
      alert(`Método de pagamento '${selectedMethod}' ainda não implementado.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-4 md:p-8 flex justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Escolha o Método de Pagamento</CardTitle>
            <CardDescription>Você está agendando uma sessão com {appointmentDetails.therapistName} no valor de R$ {appointmentDetails.price.toFixed(2)}.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="credit-card" onValueChange={setSelectedMethod} className="space-y-4">
              <Label htmlFor="credit-card" className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                <RadioGroupItem value="credit-card" id="credit-card" className="mr-4" />
                <CreditCard className="h-5 w-5 mr-3" />
                <span className="font-semibold">Cartão de Crédito</span>
              </Label>
              <Label htmlFor="pix" className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                <RadioGroupItem value="pix" id="pix" className="mr-4" />
                <QrCode className="h-5 w-5 mr-3" />
                <span className="font-semibold">PIX</span>
              </Label>
              <Label htmlFor="boleto" className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                <RadioGroupItem value="boleto" id="boleto" className="mr-4" />
                <Barcode className="h-5 w-5 mr-3" />
                <span className="font-semibold">Boleto Bancário</span>
              </Label>
            </RadioGroup>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" onClick={handleContinue}>Continuar</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PaymentMethodPage;
