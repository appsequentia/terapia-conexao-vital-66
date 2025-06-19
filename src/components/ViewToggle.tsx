
import { Button } from '@/components/ui/button';
import { Grid3X3, List } from 'lucide-react';

interface ViewToggleProps {
  value: 'grid' | 'list';
  onChange: (value: 'grid' | 'list') => void;
}

const ViewToggle = ({ value, onChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-1 border rounded-md p-1">
      <Button
        variant={value === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('list')}
        className="h-8 w-8 p-0"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={value === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('grid')}
        className="h-8 w-8 p-0"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewToggle;
