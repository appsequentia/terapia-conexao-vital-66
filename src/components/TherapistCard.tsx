
import { Star, MapPin, Clock, Video, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TherapistProfile } from '@/types/therapist';

interface TherapistCardProps {
  therapist: TherapistProfile;
}

const TherapistCard = ({ therapist }: TherapistCardProps) => {
  return (
    <div className="therapist-card p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar className="w-20 h-20">
            <AvatarImage src={therapist.photo} alt={therapist.name} />
            <AvatarFallback>{therapist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {therapist.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1">{therapist.rating}</span>
                  <span className="ml-1">({therapist.reviewCount} avaliações)</span>
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
                R$ {therapist.pricePerSession}
              </div>
              <div className="text-sm text-gray-500">por sessão</div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {therapist.bio}
          </p>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1 mb-3">
            {therapist.specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty.id} variant="outline" className="text-xs">
                {specialty.name}
              </Badge>
            ))}
            {therapist.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{therapist.specialties.length - 3} mais
              </Badge>
            )}
          </div>

          {/* Info Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {therapist.location.city}, {therapist.location.state}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {therapist.experience} anos de experiência
            </div>
            {therapist.location.offersOnline && (
              <div className="flex items-center">
                <Video className="h-4 w-4 mr-1" />
                Atendimento online
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="flex-1 sm:flex-initial">
              <Calendar className="h-4 w-4 mr-2" />
              Agendar Consulta
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-initial">
              Ver Perfil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistCard;
