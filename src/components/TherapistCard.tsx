
import { Star, MapPin, Clock, Video, Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TherapistProfile } from '@/types/therapist';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface TherapistCardProps {
  therapist: TherapistProfile;
}

const TherapistCard = ({ therapist }: TherapistCardProps) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  console.log('TherapistCard - Rendering therapist:', {
    id: therapist.id,
    name: therapist.name,
    hasSpecialties: Array.isArray(therapist.specialties),
    specialtiesCount: therapist.specialties?.length || 0,
    hasApproaches: Array.isArray(therapist.approaches),
    approachesCount: therapist.approaches?.length || 0,
    specialties: therapist.specialties?.map(s => s.name) || [],
    approaches: therapist.approaches?.map(a => a.name) || []
  });

  const handleViewProfile = () => {
    console.log('[TherapistCard] ===== NAVEGAÇÃO PARA PERFIL =====');
    console.log('[TherapistCard] therapist.id:', therapist.id);
    console.log('[TherapistCard] ID length:', therapist.id?.length);
    console.log('[TherapistCard] ID type:', typeof therapist.id);
    console.log('[TherapistCard] Is valid UUID format:', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(therapist.id || ''));
    console.log('[TherapistCard] Navigating to:', `/terapeuta/${therapist.id}`);
    navigate(`/terapeuta/${therapist.id}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(therapist.id);
  };

  const handleSchedule = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/agendamento/${therapist.id}`);
  };

  // Safe fallback for missing data
  const therapistName = therapist.name || 'Nome não disponível';
  const therapistSpecialties = Array.isArray(therapist.specialties) ? therapist.specialties : [];
  const therapistApproaches = Array.isArray(therapist.approaches) ? therapist.approaches : [];
  const therapistRating = therapist.rating || 0;
  const therapistReviewCount = therapist.reviewCount || 0;
  const therapistPrice = therapist.pricePerSession || 0;
  const therapistBio = therapist.bio || 'Biografia não disponível';
  const therapistExperience = therapist.experience || 0;

  return (
    <div className="therapist-card p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar className="w-20 h-20">
            <AvatarImage src={therapist.photo} alt={therapistName} />
            <AvatarFallback>{therapistName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {therapistName}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleFavorite}
                  className="h-8 w-8"
                >
                  <Heart 
                    className={cn(
                      "h-4 w-4 transition-colors", 
                      isFavorite(therapist.id) 
                        ? "fill-red-500 text-red-500" 
                        : "text-gray-400 hover:text-red-500"
                    )} 
                  />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1">{therapistRating}</span>
                  <span className="ml-1">({therapistReviewCount} avaliações)</span>
                </div>
                {therapist.isOnline && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Online
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-primary">
                R$ {therapistPrice}
              </div>
              <div className="text-sm text-gray-500">por sessão</div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {therapistBio}
          </p>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1 mb-3">
            {therapistSpecialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty.id} variant="outline" className="text-xs">
                {specialty.name}
              </Badge>
            ))}
            {therapistSpecialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{therapistSpecialties.length - 3} mais
              </Badge>
            )}
            {therapistSpecialties.length === 0 && (
              <Badge variant="outline" className="text-xs text-gray-400">
                Especialidades não informadas
              </Badge>
            )}
          </div>

          {/* Info Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {therapist.location?.city || 'Cidade não informada'}, {therapist.location?.state || 'Estado não informado'}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {therapistExperience} anos de duração da terapia
            </div>
            {therapist.location?.offersOnline && (
              <div className="flex items-center">
                <Video className="h-4 w-4 mr-1" />
                Atendimento online
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="flex-1 sm:flex-initial" onClick={handleSchedule}>
              <Calendar className="h-4 w-4 mr-2" />
              Agendar Consulta
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-initial" onClick={handleViewProfile}>
              Ver Perfil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistCard;
