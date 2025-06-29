import React, { useEffect, useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Pagamento realizado com sucesso!');
          break;
        case 'processing':
          setMessage('Seu pagamento está sendo processado.');
          break;
        case 'requires_payment_method':
          setMessage('Seu pagamento não foi bem-sucedido, por favor, tente novamente.');
          break;
        default:
          setMessage('Algo deu errado.');
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js ainda não carregou.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // URL para onde o cliente será redirecionado após o pagamento.
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    // Este código só será executado se houver um erro imediato durante a confirmação do pagamento.
    // Caso contrário, o cliente será redirecionado para a `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message || 'Ocorreu um erro com seu cartão.');
    } else {
      setMessage('Ocorreu um erro inesperado.');
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
      <Button disabled={isLoading || !stripe || !elements} id="submit" className="w-full mt-6" size="lg">
        <span id="button-text">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Pagar Agora'}
        </span>
      </Button>
      {/* Exibe mensagens de erro ou sucesso */}
      {message && <div id="payment-message" className="text-red-500 text-sm mt-2 text-center">{message}</div>}
    </form>
  );
}
