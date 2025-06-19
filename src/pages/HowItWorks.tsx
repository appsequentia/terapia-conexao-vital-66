
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, UserCheck, Calendar, MessageCircle, FileCheck, Settings, Users, Star, Shield, Clock, CreditCard, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const HowItWorks = () => {
  const patientSteps = [
    {
      icon: Search,
      title: "1. Busque seu terapeuta",
      description: "Use nossos filtros para encontrar o profissional ideal baseado em especialidade, localização e disponibilidade."
    },
    {
      icon: UserCheck,
      title: "2. Escolha o profissional",
      description: "Visualize perfis detalhados, avaliações de outros pacientes e escolha quem mais se adequa às suas necessidades."
    },
    {
      icon: Calendar,
      title: "3. Agende sua consulta",
      description: "Selecione data e horário disponíveis, escolha entre modalidade online ou presencial e efetue o pagamento."
    },
    {
      icon: MessageCircle,
      title: "4. Tenha sua consulta",
      description: "Participe da sessão no horário marcado e mantenha contato com seu terapeuta através da plataforma."
    }
  ];

  const therapistSteps = [
    {
      icon: FileCheck,
      title: "1. Cadastre-se",
      description: "Crie sua conta e envie sua documentação profissional para verificação de credenciais."
    },
    {
      icon: Shield,
      title: "2. Seja verificado",
      description: "Nossa equipe analisa seus documentos e valida suas qualificações profissionais."
    },
    {
      icon: Settings,
      title: "3. Configure seu perfil",
      description: "Personalize seu perfil, defina especialidades, valores e disponibilidade de horários."
    },
    {
      icon: Users,
      title: "4. Comece a atender",
      description: "Receba solicitações de pacientes e gerencie sua agenda através da nossa plataforma."
    }
  ];

  const faqs = [
    {
      question: "Como posso ter certeza de que os terapeutas são qualificados?",
      answer: "Todos os profissionais passam por um rigoroso processo de verificação. Checamos diplomas, registros no conselho profissional e experiência. Apenas terapeutas licenciados e em situação regular podem atender na plataforma."
    },
    {
      question: "Como funciona o pagamento?",
      answer: "Os pagamentos são processados de forma segura através da plataforma. Você paga antecipadamente ao agendar a consulta. Aceitamos cartão de crédito, PIX e outros métodos de pagamento."
    },
    {
      question: "Posso cancelar ou reagendar uma consulta?",
      answer: "Sim, você pode cancelar ou reagendar até 24 horas antes da consulta sem custos adicionais. Cancelamentos com menos de 24 horas podem ter taxas aplicadas conforme política do terapeuta."
    },
    {
      question: "As consultas online são seguras?",
      answer: "Absolutamente. Utilizamos criptografia de ponta e nossa plataforma atende a todos os requisitos de privacidade e segurança para atendimentos de saúde mental online."
    },
    {
      question: "Como escolho o terapeuta certo para mim?",
      answer: "Use nossos filtros por especialidade, abordagem terapêutica e avaliações. Você também pode ler os perfis detalhados e ver as avaliações de outros pacientes para tomar uma decisão informada."
    },
    {
      question: "Vocês oferecem reembolso?",
      answer: "Oferecemos reembolso integral para cancelamentos feitos com mais de 24 horas de antecedência. Para outros casos, nossa política de reembolso varia conforme as circunstâncias específicas."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Como Funciona a Sequentia
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
            Uma plataforma simples e segura que conecta você aos melhores profissionais de saúde mental
          </p>
        </div>
      </section>

      {/* Para Pacientes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Para Pacientes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Em poucos passos você encontra e agenda consultas com terapeutas qualificados
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {patientSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/encontrar-terapeutas">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Encontrar Terapeuta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Para Terapeutas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Para Terapeutas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expanda sua prática e alcance mais pacientes através da nossa plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {therapistSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              Cadastre-se como Terapeuta
            </Button>
          </div>
        </div>
      </section>

      {/* Vantagens da Plataforma */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que usar a Sequentia?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Segurança e Privacidade</h3>
              <p className="text-gray-600">Todos os dados são protegidos com criptografia de ponta e seguimos rigorosos protocolos de segurança.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Flexibilidade Total</h3>
              <p className="text-gray-600">Agende consultas quando e onde for conveniente, com opções online e presenciais.</p>
            </div>

            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Pagamento Simplificado</h3>
            <p className="text-gray-600">Sistema de pagamento integrado, seguro e com várias opções de pagamento disponíveis.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-gray-600">
              Encontre respostas para as dúvidas mais comuns
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border border-gray-200">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center text-left">
                    <HelpCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    <span className="font-medium">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Junte-se a milhares de pessoas que já encontraram ajuda através da nossa plataforma
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/encontrar-terapeutas">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Buscar Terapeuta
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
