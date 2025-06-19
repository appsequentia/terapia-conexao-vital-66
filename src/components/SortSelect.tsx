
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const SortSelect = ({ value, onChange }: SortSelectProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 whitespace-nowrap">Ordenar por:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rating">Melhor Avaliado</SelectItem>
          <SelectItem value="price-low">Menor Preço</SelectItem>
          <SelectItem value="price-high">Maior Preço</SelectItem>
          <SelectItem value="experience">Mais Experiência</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortSelect;
