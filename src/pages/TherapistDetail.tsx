
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, Video, User, Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { useTherapistDetail } from '@/hooks/useTherapistDetail';

const TherapistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: therapist, isLoading, error } = useTherapistDetail(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Carregando perfil do terapeuta...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !therapist) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-4">
              Terapeuta não encontrado ou erro ao carregar dados.
            </p>
            <Button onClick={() => navigate('/encontrar-terapeutas')} variant="outline">
              Voltar à Lista
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/encontrar-terapeutas')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar à Lista
        </Button>

        {/* Main Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32 mx-auto md:mx-0">
                  <AvatarImage src={therapist.photo} alt={therapist.name} />
                  <AvatarFallback className="text-2xl">
                    {therapist.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {therapist.isOnline && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 mt-2 justify-center">
                    Online Agora
                  </Badge>
                )}
              </div>

              {/* Main Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {therapist.name}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600 mb-2">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">{therapist.rating}</span>
                        <span className="ml-1">({therapist.reviewCount} avaliações)</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {therapist.location.city}, {therapist.location.state}
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {therapist.experience} anos de experiência
                    </div>
                  </div>
                  
                  <div className="text-center md:text-right">
                    <div className="text-3xl font-bold text-primary mb-1">
                      R$ {therapist.pricePerSession}
                    </div>
                    <div className="text-gray-500">por sessão</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Consulta
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="h-4 w-4 mr-2" />
                    Favoritar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{therapist.bio}</p>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card>
              <CardHeader>
                <CardTitle>Especialidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {therapist.specialties.map((specialty) => (
                    <Badge key={specialty.id} variant="secondary">
                      {specialty.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Approaches */}
            <Card>
              <CardHeader>
                <CardTitle>Abordagens Terapêuticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {therapist.approaches.map((approach) => (
                    <Badge key={approach.id} variant="outline">
                      {approach.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Credentials */}
            {therapist.credentials.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Credenciais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {therapist.credentials.map((credential) => (
                      <div key={credential.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{credential.type} - {credential.number}</div>
                          <div className="text-sm text-gray-600">{credential.issuingBody}</div>
                        </div>
                        {credential.verified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Verificado
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Types */}
            <Card>
              <CardHeader>
                <CardTitle>Modalidades de Atendimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {therapist.location.offersOnline && (
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-3 text-blue-600" />
                      <span>Atendimento Online</span>
                    </div>
                  )}
                  {therapist.location.offersInPerson && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-3 text-green-600" />
                      <span>Atendimento Presencial</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle>Idiomas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {therapist.languages.map((language, index) => (
                    <Badge key={index} variant="outline">
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Enviar Mensagem
                  </Button>
                  <Button variant="outline" className="w-full">
                    Ver Disponibilidade
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistDetail;
