
import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (query: string, location: string) => void;
  isHomePage?: boolean;
}

const SearchBar = ({ onSearch, isHomePage = false }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (isHomePage) {
      // Navigate to FindTherapists page with search parameters
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.set('q', searchQuery.trim());
      }
      if (location.trim()) {
        params.set('location', location.trim());
      }
      
      const queryString = params.toString();
      navigate(`/encontrar-terapeutas${queryString ? `?${queryString}` : ''}`);
    } else {
      // Call the onSearch callback for the FindTherapists page
      if (onSearch) {
        onSearch(searchQuery, location);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
            onKeyPress={handleKeyPress}
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
            onKeyPress={handleKeyPress}
            className="pl-10 search-input"
          />
        </div>

        {/* Search Button */}
        <Button 
          className="lg:w-auto bg-primary hover:bg-primary/90"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
