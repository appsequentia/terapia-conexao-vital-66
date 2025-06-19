
import { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Busque por especialidade, nome ou abordagem..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 search-input"
          />
        </div>

        {/* Location Input */}
        <div className="lg:w-64 relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Localização"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 search-input"
          />
        </div>

        {/* Filter Button */}
        <Button variant="outline" className="lg:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>

        {/* Search Button */}
        <Button className="lg:w-auto bg-primary hover:bg-primary/90">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
