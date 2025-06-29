
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, CreditCard, QrCode, FileText, Shield } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const CheckoutPage = () => {
  const { appointmentId, method } = useParams<{ appointmentId: string; method: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [saveCard, setSaveCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const processPaymentMutation = useMutation({
    mutationFn: async () => {
      if (!appointmentId) throw new Error('ID do agendamento não fornecido');
      
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar status do agendamento
      const { error } = await supabase
        .from('appointments')
        .update({
          status: 'confirmed',
          payment_status: 'paid'
        })
        .eq('id', appointmentId);

      if (error) throw error;
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: 'Pagamento realizado!',
        description: 'Seu agendamento foi confirmado com sucesso.',
      });
      navigate('/payment-success');
    },
    onError: (error) => {
      console.error('Erro no pagamento:', error);
      toast({
        title: 'Erro no pagamento',
        description: 'Não foi possível processar o pagamento. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const handlePayment = async () => {
    if (method === 'credit-card') {
      if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
        toast({
          title: 'Dados incompletos',
          description: 'Por favor, preencha todos os campos do cartão.',
          variant: 'destructive',
        });
        return;
      }
    }
    
    setIsProcessing(true);
    try {
      await processPaymentMutation.mutateAsync();
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getMethodIcon = () => {
    switch (method) {
      case 'credit-card':
        return <CreditCard className="h-5 w-5" />;
      case 'pix':
        return <QrCode className="h-5 w-5" />;
      case 'boleto':
        return <FileText className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getMethodName = () => {
    switch (method) {
      case 'credit-card':
        return 'Cartão de Crédito';
      case 'pix':
        return 'PIX';
      case 'boleto':
        return 'Boleto';
      default:
        return 'Pagamento';
    }
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
          
          <div className="flex items-center gap-2 mb-2">
            {getMethodIcon()}
            <h1 className="text-2xl font-bold">Checkout - {getMethodName()}</h1>
          </div>
          <p className="text-muted-foreground">
            Finalize seu pagamento de forma segura
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Dados do Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              {method === 'credit-card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input
                      id="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      value={cardData.number}
                      onChange={(e) => setCardData(prev => ({ ...prev, number: e.target.value }))}
                      maxLength={19}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cardName">Nome no Cartão</Label>
                    <Input
                      id="cardName"
                      placeholder="Nome como impresso no cartão"
                      value={cardData.name}
                      onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Validade</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/AA"
                        value={cardData.expiry}
                        onChange={(e) => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                        maxLength={4}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="saveCard" 
                      checked={saveCard}
                      onCheckedChange={setSaveCard}
                    />
                    <Label htmlFor="saveCard" className="text-sm">
                      Salvar cartão para próximas compras
                    </Label>
                  </div>
                </div>
              )}

              {method === 'pix' && (
                <div className="text-center py-8">
                  <QrCode className="h-32 w-32 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Pagamento via PIX</h3>
                  <p className="text-muted-foreground mb-4">
                    Escaneie o código QR ou copie o código PIX
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <code className="text-sm break-all">
                      00020126580014BR.GOV.BCB.PIX0136{appointmentId}52040000530398654{appointment?.therapist?.price_per_session || 150}5802BR5925SEQUENTIA TERAPIA6009SAO PAULO62070503***6304
                    </code>
                  </div>
                </div>
              )}

              {method === 'boleto' && (
                <div className="text-center py-8">
                  <FileText className="h-32 w-32 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Boleto Bancário</h3>
                  <p className="text-muted-foreground mb-4">
                    Vencimento em até 3 dias úteis
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Após clicar em "Pagar", o boleto será gerado e enviado para download
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumo do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Consulta com {appointment?.therapist?.nome}</span>
                  <span>{formatPrice(appointment?.therapist?.price_per_session)}</span>
                </div>
              </div>
              
              <hr />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-primary">
                  {formatPrice(appointment?.therapist?.price_per_session)}
                </span>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full"
                disabled={isProcessing}
                size="lg"
              >
                {isProcessing ? 'Processando...' : 'Pagar'}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
                <Shield className="h-4 w-4" />
                <span>Pagamento 100% seguro e criptografado</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
