import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  type: z.enum(['client', 'therapist']),
  acceptTerms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos de uso'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      type: 'client',
      acceptTerms: false,
    },
  });

  const watchType = watch('type');
  const watchAcceptTerms = watch('acceptTerms');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        type: data.type,
      });
      
      toast({
        title: 'Conta criada com sucesso!',
        description: data.type === 'therapist' 
          ? 'Agora vamos configurar seu perfil profissional.'
          : 'Verifique seu e-mail para confirmar sua conta.',
      });
      
      // Redirecionamento condicional
      if (data.type === 'therapist') {
        navigate('/perfil-terapeuta');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Erro desconhecido';
      
      if (error instanceof Error) {
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este e-mail já está cadastrado';
        } else if (error.message.includes('Password should be at least 6 characters')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: 'Erro no cadastro',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            Sequentia
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              faça login em sua conta existente
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Seletor de tipo de usuário */}
          <div>
            <Label>Tipo de conta</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="client"
                  value="client"
                  checked={watchType === 'client'}
                  onChange={() => setValue('type', 'client')}
                  className="text-primary focus:ring-primary"
                />
                <Label htmlFor="client" className="font-normal">
                  Sou cliente (busco terapia)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="therapist"
                  value="therapist"
                  checked={watchType === 'therapist'}
                  onChange={() => setValue('type', 'therapist')}
                  className="text-primary focus:ring-primary"
                />
                <Label htmlFor="therapist" className="font-normal">
                  Sou terapeuta (ofereço serviços)
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome completo</Label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="name"
                  type="text"
                  className="pl-10"
                  placeholder="Seu nome completo"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  placeholder="seu@email.com"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={watchAcceptTerms}
              onCheckedChange={(checked) => setValue('acceptTerms', !!checked)}
            />
            <Label htmlFor="acceptTerms" className="text-sm font-normal">
              Aceito os{' '}
              <button
                type="button"
                className="text-primary hover:text-primary/80 underline"
                onClick={() => toast({ title: 'Termos de Uso', description: 'Modal será implementado em breve.' })}
              >
                Termos de Uso
              </button>{' '}
              e{' '}
              <button
                type="button"
                className="text-primary hover:text-primary/80 underline"
                onClick={() => toast({ title: 'Política de Privacidade', description: 'Modal será implementado em breve.' })}
              >
                Política de Privacidade
              </button>
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
