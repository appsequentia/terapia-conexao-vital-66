
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  Briefcase, 
  Shield, 
  Clock, 
  CreditCard, 
  CheckCircle, 
  Star,
  FileCheck,
  Settings,
  HelpCircle
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ParaTerapeutas = () => {
  const benefits = [
    {
      icon: Users,
      title: "Mais Pacientes",
      description: "Acesse uma base crescente de pacientes que procuram atendimento psicológico de qualidade."
    },
    {
      icon: Clock,
      title: "Agenda Flexível",
      description: "Gerencie seus horários com total autonomia, definindo disponibilidade e modalidades de atendimento."
    },
    {
      icon: CreditCard,
      title: "Pagamentos Seguros",
      description: "Receba seus pagamentos de forma automática e segura, sem se preocupar com cobranças."
    },
    {
      icon: TrendingUp,
      title: "Cresça Profissionalmente",
      description: "Expanda sua prática e desenvolva sua carreira com ferramentas profissionais de gestão."
    }
  ];

  const steps = [
    {
      icon: FileCheck,
      title: "1. Cadastro",
      description: "Crie sua conta e envie sua documentação profissional (CRP, diplomas, certificados)."
    },
    {
      icon: Shield,
      title: "2. Verificação",
      description: "Nossa equipe analisa e valida suas credenciais profissionais em até 48 horas."
    },
    {
      icon: Settings,
      title: "3. Configuração",
      description: "Personalize seu perfil, defina especialidades, valores e configure sua agenda."
    },
    {
      icon: Briefcase,
      title: "4. Comece a Atender",
      description: "Receba solicitações de pacientes e comece a expandir sua prática profissional."
    }
  ];

  const requirements = [
    "Registro ativo no Conselho Regional de Psicologia (CRP)",
    "Formação em Psicologia reconhecida pelo MEC",
    "Experiência mínima de 6 meses em atendimento clínico",
    "Disponibilidade para atendimentos online ou presenciais"
  ];

  const testimonials = [
    {
      name: "Dra. Maria Silva",
      specialty: "Psicologia Clínica",
      text: "A Sequentia me permitiu alcançar mais pacientes e organizar melhor minha agenda. O suporte é excelente!",
      rating: 5
    },
    {
      name: "Dr. João Santos",
      specialty: "Terapia Cognitiva",
      text: "Plataforma intuitiva e pagamentos pontuais. Recomendo para todos os colegas da área.",
      rating: 5
    },
    {
      name: "Dra. Ana Costa",
      specialty: "Psicoterapia",
      text: "Triplicou meu número de pacientes em apenas 3 meses. Ferramenta indispensável!",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "Qual é a taxa da plataforma?",
      answer: "Cobramos uma taxa de 15% sobre o valor de cada consulta realizada. Sem taxas de cadastro ou mensalidades."
    },
    {
      question: "Como funciona o processo de verificação?",
      answer: "Analisamos seus documentos profissionais (CRP, diplomas) e validamos sua experiência. O processo leva até 48 horas."
    },
    {
      question: "Quando recebo os pagamentos?",
      answer: "Os pagamentos são liberados semanalmente, sempre às terças-feiras, via PIX ou transferência bancária."
    },
    {
      question: "Posso definir meus próprios preços?",
      answer: "Sim! Você tem total autonomia para definir os valores de suas consultas, respeitando o mercado local."
    },
    {
      question: "É obrigatório atender online?",
      answer: "Não. Você pode escolher entre atendimento online, presencial ou ambos, conforme sua preferência."
    },
    {
      question: "Há suporte técnico disponível?",
      answer: "Sim! Nossa equipe oferece suporte técnico completo via chat, email e telefone durante o horário comercial."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Expanda sua Prática Profissional
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto mb-8">
            Conecte-se com mais pacientes e faça crescer sua carreira como terapeuta através da nossa plataforma
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cadastro">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Começar Agora
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher a Sequentia?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Uma plataforma completa para profissionais que querem expandir sua prática
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Como Funciona para Terapeutas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Processo simples e rápido para começar a atender pacientes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
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
        </div>
      </section>

      {/* Requisitos Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Requisitos para Cadastro
            </h2>
            <p className="text-lg text-gray-600">
              Verifique se você atende aos requisitos para se tornar um terapeuta parceiro
            </p>
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-6 w-6 text-primary mr-2" />
                Documentação Necessária
              </CardTitle>
              <CardDescription>
                Para garantir a qualidade dos serviços, solicitamos:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Depoimentos Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              O que nossos terapeutas dizem
            </h2>
            <p className="text-lg text-gray-600">
              Histórias reais de profissionais que transformaram suas práticas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.specialty}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Valores Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Valores Transparentes
          </h2>
          
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/20">
            <CardContent className="p-8">
              <div className="text-4xl font-bold text-primary mb-4">15%</div>
              <p className="text-xl text-gray-700 mb-4">
                Taxa única sobre consultas realizadas
              </p>
              <ul className="text-left space-y-2 text-gray-600 max-w-md mx-auto">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  Sem taxa de cadastro
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  Sem mensalidade
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  Pagamentos semanais
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-2" />
                  Suporte técnico incluído
                </li>
              </ul>
            </CardContent>
          </Card>
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
              Tire suas dúvidas sobre como funciona para terapeutas
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
            Pronto para expandir sua prática?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Junte-se a centenas de terapeutas que já transformaram suas carreiras conosco
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cadastro">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Cadastrar-se Agora
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Falar com Consultor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ParaTerapeutas;
