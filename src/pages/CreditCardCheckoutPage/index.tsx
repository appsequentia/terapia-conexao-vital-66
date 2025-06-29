import React, { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions, Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useLocation } from 'react-router-dom';

import CheckoutForm from '@/components/payment/CheckoutForm';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// A chave pública do Stripe DEVE ser armazenada em variáveis de ambiente.
// Ex: VITE_STRIPE_PUBLIC_KEY
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51Hh9gGLA9A2XGqgC6A5VbVqE8Z4v8v8v8v8v8v8v8v8v8v8v8v8v8v8v8v8v8v8v8v8v8v8v8v8v8v');

const CreditCardCheckoutPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState('');
  const location = useLocation();
  const { appointmentDetails } = location.state || {
    appointmentDetails: {
      price: 150,
    },
  };

  useEffect(() => {
    // --- IMPORTANTE ---
    // Em um cenário real, você faria uma chamada ao seu backend para criar um "PaymentIntent"
    // e obter o clientSecret. O backend usaria a chave secreta do Stripe para isso.
    // Ex: fetch('/api/create-payment-intent', { ... })

    // Para fins de desenvolvimento do frontend, estamos usando um valor mockado.
    // O formulário do Stripe Elements irá detectar que este não é um clientSecret válido
    // e exibirá um erro, o que é esperado sem um backend funcional.
    setClientSecret('pi_12345_secret_67890_mock');
  }, [appointmentDetails.price]);

  const appearance: Appearance = {
    theme: 'stripe',
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto p-4 md:p-8 flex justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Pagamento com Cartão de Crédito</CardTitle>
            <CardDescription>Insira os dados do seu cartão para finalizar o agendamento.</CardDescription>
          </CardHeader>
          <CardContent>
            {clientSecret ? (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            ) : (
                <div className="text-center p-8">
                    <p>Inicializando o formulário de pagamento...</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreditCardCheckoutPage;
