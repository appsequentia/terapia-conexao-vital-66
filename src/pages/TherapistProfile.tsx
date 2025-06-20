
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTherapistProfile } from '@/hooks/useTherapistProfile';
import ImageUpload from '@/components/ImageUpload';
import FormationInput, { Formation } from '@/components/FormationInput';
import { X } from 'lucide-react';

const abordagensOptions = [
  'Terapia Cognitivo-Comportamental (TCC)',
  'Psicanálise',
  'Gestalt-terapia',
  'Terapia Humanística',
  'Terapia Sistêmica',
  'EMDR',
  'Terapia Breve',
  'Psicodrama',
  'Arteterapia',
  'Terapia Familiar'
];

const especialidadesOptions = [
  'Ansiedade',
  'Depressão',
  'Relacionamentos',
  'Autoestima',
  'Transtornos Alimentares',
  'Trauma',
  'Luto',
  'Estresse',
  'Síndrome do Pânico',
  'TOC',
  'TDAH',
  'Dependência Química',
  'Terapia de Casal',
  'Terapia Familiar',
  'Orientação Profissional'
];

const therapistProfileSchema = z.object({
  abordagem: z.string().min(1, 'Selecione uma abordagem terapêutica'),
  especialidades: z.array(z.string()).min(1, 'Selecione pelo menos uma especialidade'),
  pricePerSession: z.number().min(1, 'Informe o valor por sessão'),
  bio: z.string().min(50, 'A descrição deve ter pelo menos 50 caracteres'),
  cidade: z.string().min(2, 'Informe a cidade de atendimento'),
  formations: z.array(z.object({
    id: z.string(),
    institution: z.string().min(1, 'Informe a instituição'),
    year: z.string().min(4, 'Informe o ano de conclusão')
  })).min(1, 'Adicione pelo menos uma formação acadêmica'),
  photoUrl: z.string().optional()
});

type TherapistProfileFormData = z.infer<typeof therapistProfileSchema>;

const TherapistProfile = () => {
  const [selectedEspecialidades, setSelectedEspecialidades] = useState<string[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const { user, profile, isLoading: authLoading } = useAuth();
  const { mutate: saveProfile, isPending } = useTherapistProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TherapistProfileFormData>({
    resolver: zodResolver(therapistProfileSchema),
    defaultValues: {
      especialidades: [],
      formations: [],
    },
  });

  const watchPrice = watch('pricePerSession');

  // Verificar se o usuário está autenticado e é terapeuta
  useEffect(() => {
    if (!authLoading && (!user || !profile)) {
      navigate('/login');
      return;
    }

    if (!authLoading && profile && profile.tipo_usuario !== 'therapist') {
      toast({
        title: 'Acesso negado',
        description: 'Esta página é apenas para terapeutas.',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }
  }, [user, profile, authLoading, navigate, toast]);

  // Adicionar especialidade
  const addEspecialidade = (especialidade: string) => {
    if (!selectedEspecialidades.includes(especialidade)) {
      const newEspecialidades = [...selectedEspecialidades, especialidade];
      setSelectedEspecialidades(newEspecialidades);
      setValue('especialidades', newEspecialidades);
    }
  };

  // Remover especialidade
  const removeEspecialidade = (especialidade: string) => {
    const newEspecialidades = selectedEspecialidades.filter(e => e !== especialidade);
    setSelectedEspecialidades(newEspecialidades);
    setValue('especialidades', newEspecialidades);
  };

  const onSubmit = async (data: TherapistProfileFormData) => {
    if (!user || !profile) return;

    try {
      await saveProfile({
        nome: profile.nome,
        email: profile.email,
        foto_url: photoUrl,
        bio: data.bio,
        especialidades: data.especialidades,
        abordagens: [data.abordagem],
        cidade: data.cidade,
        price_per_session: data.pricePerSession,
        formacao: data.formations.map(f => ({
          institution: f.institution,
          year: f.year
        }))
      });

      toast({
        title: 'Perfil salvo com sucesso!',
        description: 'Seu perfil profissional foi criado. Bem-vindo ao Sequentia!',
      });

      navigate('/');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Erro ao salvar perfil',
        description: 'Ocorreu um erro ao salvar seu perfil. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Configure seu Perfil Profissional
          </h1>
          <p className="mt-2 text-gray-600">
            Preencha as informações para criar seu perfil de terapeuta
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados Profissionais</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Upload de foto */}
              <div className="text-center">
                <Label className="text-base font-medium">Foto de Perfil</Label>
                <div className="mt-2">
                  <ImageUpload
                    currentImageUrl={photoUrl}
                    onImageChange={setPhotoUrl}
                    size="lg"
                  />
                </div>
              </div>

              {/* Abordagem terapêutica */}
              <div>
                <Label htmlFor="abordagem">Abordagem Terapêutica *</Label>
                <Controller
                  name="abordagem"
                  control={control}
                  render={({ fiel }) => (
                    <Select onValueChange={(value) => setValue('abordagem', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione sua abordagem principal" />
                      </SelectTrigger>
                      <SelectContent>
                        {abordagensOptions.map((abordagem) => (
                          <SelectItem key={abordagem} value={abordagem}>
                            {abordagem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.abordagem && (
                  <p className="mt-1 text-sm text-red-600">{errors.abordagem.message}</p>
                )}
              </div>

              {/* Especialidades */}
              <div>
                <Label>Especialidades *</Label>
                <div className="mt-2">
                  <Select onValueChange={addEspecialidade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Adicionar especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {especialidadesOptions
                        .filter(esp => !selectedEspecialidades.includes(esp))
                        .map((especialidade) => (
                          <SelectItem key={especialidade} value={especialidade}>
                            {especialidade}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedEspecialidades.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedEspecialidades.map((especialidade) => (
                        <Badge
                          key={especialidade}
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1"
                        >
                          {especialidade}
                          <button
                            type="button"
                            onClick={() => removeEspecialidade(especialidade)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {errors.especialidades && (
                  <p className="mt-1 text-sm text-red-600">{errors.especialidades.message}</p>
                )}
              </div>

              {/* Valor por sessão */}
              <div>
                <Label htmlFor="pricePerSession">Valor por Sessão (R$) *</Label>
                <Input
                  id="pricePerSession"
                  type="number"
                  step="0.01"
                  placeholder="150.00"
                  className="mt-1"
                  {...register('pricePerSession', { valueAsNumber: true })}
                />
                {watchPrice && (
                  <p className="mt-1 text-sm text-gray-600">
                    Valor formatado: R$ {watchPrice.toFixed(2).replace('.', ',')}
                  </p>
                )}
                {errors.pricePerSession && (
                  <p className="mt-1 text-sm text-red-600">{errors.pricePerSession.message}</p>
                )}
              </div>

              {/* Bio/Descrição */}
              <div>
                <Label htmlFor="bio">Descrição Profissional *</Label>
                <Textarea
                  id="bio"
                  placeholder="Descreva sua experiência, abordagem e como você pode ajudar seus clientes..."
                  className="mt-1 min-h-[120px]"
                  {...register('bio')}
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                )}
              </div>

              {/* Formação acadêmica */}
              <FormationInput
                formations={formations}
                onChange={(newFormations) => {
                  setFormations(newFormations);
                  setValue('formations', newFormations);
                }}
              />
              {errors.formations && (
                <p className="mt-1 text-sm text-red-600">{errors.formations.message}</p>
              )}

              {/* Cidade */}
              <div>
                <Label htmlFor="cidade">Cidade de Atendimento *</Label>
                <Input
                  id="cidade"
                  placeholder="Ex: São Paulo, SP"
                  className="mt-1"
                  {...register('cidade')}
                />
                {errors.cidade && (
                  <p className="mt-1 text-sm text-red-600">{errors.cidade.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? 'Salvando perfil...' : 'Salvar perfil'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TherapistProfile;
