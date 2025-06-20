
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

export interface Formation {
  id: string;
  institution: string;
  year: string;
}

interface FormationInputProps {
  formations: Formation[];
  onChange: (formations: Formation[]) => void;
}

const FormationInput: React.FC<FormationInputProps> = ({ formations, onChange }) => {
  const addFormation = () => {
    const newFormation: Formation = {
      id: Date.now().toString(),
      institution: '',
      year: ''
    };
    onChange([...formations, newFormation]);
  };

  const removeFormation = (id: string) => {
    onChange(formations.filter(f => f.id !== id));
  };

  const updateFormation = (id: string, field: keyof Omit<Formation, 'id'>, value: string) => {
    onChange(formations.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Formação Acadêmica</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addFormation}
          className="flex items-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar</span>
        </Button>
      </div>

      {formations.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Nenhuma formação adicionada. Clique em "Adicionar" para incluir sua formação acadêmica.
        </p>
      )}

      <div className="space-y-3">
        {formations.map((formation) => (
          <Card key={formation.id} className="p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Formação #{formations.indexOf(formation) + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFormation(formation.id)}
                  className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <Label htmlFor={`institution-${formation.id}`} className="text-sm">
                    Instituição
                  </Label>
                  <Input
                    id={`institution-${formation.id}`}
                    value={formation.institution}
                    onChange={(e) => updateFormation(formation.id, 'institution', e.target.value)}
                    placeholder="Ex: Universidade de São Paulo"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`year-${formation.id}`} className="text-sm">
                    Ano de Conclusão
                  </Label>
                  <Input
                    id={`year-${formation.id}`}
                    value={formation.year}
                    onChange={(e) => updateFormation(formation.id, 'year', e.target.value)}
                    placeholder="Ex: 2020"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FormationInput;
