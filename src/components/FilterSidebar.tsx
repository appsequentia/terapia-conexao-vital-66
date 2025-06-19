
import { useState } from 'react';
import { SearchFilters } from '@/types/therapist';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, X } from 'lucide-react';

interface FilterSidebarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

const specialtyOptions = [
  { id: '1', name: 'Ansiedade', category: 'anxiety' },
  { id: '2', name: 'Depressão', category: 'depression' },
  { id: '3', name: 'Terapia Cognitivo-Comportamental', category: 'other' },
  { id: '4', name: 'Terapia de Casal', category: 'relationship' },
  { id: '5', name: 'Relacionamentos', category: 'relationship' },
  { id: '6', name: 'Trauma', category: 'trauma' },
  { id: '7', name: 'EMDR', category: 'trauma' },
  { id: '8', name: 'Adolescentes', category: 'other' },
];

const approachOptions = [
  { id: '1', name: 'Terapia Cognitivo-Comportamental', abbreviation: 'TCC' },
  { id: '2', name: 'Terapia de Aceitação e Compromisso', abbreviation: 'ACT' },
  { id: '3', name: 'Terapia Humanística', abbreviation: 'TH' },
  { id: '4', name: 'Terapia Sistêmica', abbreviation: 'TS' },
  { id: '5', name: 'EMDR', abbreviation: 'EMDR' },
  { id: '6', name: 'Terapia do Trauma', abbreviation: 'TT' },
];

const languageOptions = ['Português', 'Inglês', 'Espanhol', 'Francês'];

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }: FilterSidebarProps) => {
  const [openSections, setOpenSections] = useState({
    specialties: true,
    approaches: true,
    price: true,
    sessionType: true,
    rating: true,
    languages: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSpecialtyChange = (specialtyId: string, checked: boolean) => {
    const newSpecialties = checked
      ? [...filters.specialties, specialtyId]
      : filters.specialties.filter(id => id !== specialtyId);
    
    onFilterChange({ ...filters, specialties: newSpecialties });
  };

  const handleApproachChange = (approachId: string, checked: boolean) => {
    const newApproaches = checked
      ? [...filters.approaches, approachId]
      : filters.approaches.filter(id => id !== approachId);
    
    onFilterChange({ ...filters, approaches: newApproaches });
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    const newLanguages = checked
      ? [...filters.languages, language]
      : filters.languages.filter(lang => lang !== language);
    
    onFilterChange({ ...filters, languages: newLanguages });
  };

  const handlePriceRangeChange = (values: number[]) => {
    onFilterChange({
      ...filters,
      priceRange: { min: values[0], max: values[1] }
    });
  };

  const handleSessionTypeChange = (type: 'online' | 'in-person' | 'both') => {
    onFilterChange({ ...filters, sessionType: type });
  };

  const handleRatingChange = (values: number[]) => {
    onFilterChange({ ...filters, rating: values[0] });
  };

  const hasActiveFilters = 
    filters.specialties.length > 0 ||
    filters.approaches.length > 0 ||
    filters.languages.length > 0 ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < 500 ||
    filters.sessionType !== 'both' ||
    filters.rating > 0;

  return (
    <div className="space-y-4">
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button 
          onClick={onClearFilters} 
          variant="outline" 
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Limpar Filtros
        </Button>
      )}

      {/* Specialties Filter */}
      <Card>
        <Collapsible open={openSections.specialties} onOpenChange={() => toggleSection('specialties')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                Especialidades
                <div className="flex items-center gap-2">
                  {filters.specialties.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {filters.specialties.length}
                    </Badge>
                  )}
                  <ChevronDown className={`h-4 w-4 transition-transform ${openSections.specialties ? 'rotate-180' : ''}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              {specialtyOptions.map((specialty) => (
                <div key={specialty.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`specialty-${specialty.id}`}
                    checked={filters.specialties.includes(specialty.id)}
                    onCheckedChange={(checked) => 
                      handleSpecialtyChange(specialty.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`specialty-${specialty.id}`} className="text-sm">
                    {specialty.name}
                  </Label>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Approaches Filter */}
      <Card>
        <Collapsible open={openSections.approaches} onOpenChange={() => toggleSection('approaches')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                Abordagens
                <div className="flex items-center gap-2">
                  {filters.approaches.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {filters.approaches.length}
                    </Badge>
                  )}
                  <ChevronDown className={`h-4 w-4 transition-transform ${openSections.approaches ? 'rotate-180' : ''}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              {approachOptions.map((approach) => (
                <div key={approach.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`approach-${approach.id}`}
                    checked={filters.approaches.includes(approach.id)}
                    onCheckedChange={(checked) => 
                      handleApproachChange(approach.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`approach-${approach.id}`} className="text-sm">
                    {approach.name} ({approach.abbreviation})
                  </Label>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                Preço por Sessão
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.price ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="px-2">
                <Slider
                  min={0}
                  max={500}
                  step={10}
                  value={[filters.priceRange.min, filters.priceRange.max]}
                  onValueChange={handlePriceRangeChange}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>R$ {filters.priceRange.min}</span>
                <span>R$ {filters.priceRange.max}</span>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Session Type Filter */}
      <Card>
        <Collapsible open={openSections.sessionType} onOpenChange={() => toggleSection('sessionType')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                Tipo de Atendimento
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.sessionType ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              {[
                { value: 'both', label: 'Ambos' },
                { value: 'online', label: 'Online' },
                { value: 'in-person', label: 'Presencial' },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`session-${option.value}`}
                    checked={filters.sessionType === option.value}
                    onCheckedChange={() => 
                      handleSessionTypeChange(option.value as 'online' | 'in-person' | 'both')
                    }
                  />
                  <Label htmlFor={`session-${option.value}`} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Rating Filter */}
      <Card>
        <Collapsible open={openSections.rating} onOpenChange={() => toggleSection('rating')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                Avaliação Mínima
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.rating ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="px-2">
                <Slider
                  min={0}
                  max={5}
                  step={0.5}
                  value={[filters.rating]}
                  onValueChange={handleRatingChange}
                  className="w-full"
                />
              </div>
              <div className="text-sm text-gray-600 text-center">
                {filters.rating > 0 ? `${filters.rating}+ estrelas` : 'Qualquer avaliação'}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Languages Filter */}
      <Card>
        <Collapsible open={openSections.languages} onOpenChange={() => toggleSection('languages')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                Idiomas
                <div className="flex items-center gap-2">
                  {filters.languages.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {filters.languages.length}
                    </Badge>
                  )}
                  <ChevronDown className={`h-4 w-4 transition-transform ${openSections.languages ? 'rotate-180' : ''}`} />
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-3">
              {languageOptions.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={`language-${language}`}
                    checked={filters.languages.includes(language)}
                    onCheckedChange={(checked) => 
                      handleLanguageChange(language, checked as boolean)
                    }
                  />
                  <Label htmlFor={`language-${language}`} className="text-sm">
                    {language}
                  </Label>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default FilterSidebar;
