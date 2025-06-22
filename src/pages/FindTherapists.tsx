
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import TherapistCard from '@/components/TherapistCard';
import FilterSidebar from '@/components/FilterSidebar';
import SortSelect from '@/components/SortSelect';
import ViewToggle from '@/components/ViewToggle';
import { useTherapists } from '@/hooks/useTherapists';
import { TherapistProfile, SearchFilters } from '@/types/therapist';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const THERAPISTS_PER_PAGE = 6;

const FindTherapists = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: therapists = [], isLoading, error } = useTherapists();
  const [filteredTherapists, setFilteredTherapists] = useState<TherapistProfile[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    specialties: [],
    approaches: [],
    priceRange: { min: 0, max: 500 },
    sessionType: 'both',
    availability: {},
    rating: 0,
    languages: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  console.log('FindTherapists - Component state:', {
    therapistsCount: therapists.length,
    filteredCount: filteredTherapists.length,
    isLoading,
    error: !!error,
    firstTherapist: therapists[0] ? {
      name: therapists[0].name,
      specialties: therapists[0].specialties?.length || 0,
      approaches: therapists[0].approaches?.length || 0
    } : null
  });

  // Initialize search from URL parameters
  useEffect(() => {
    const queryParam = searchParams.get('q') || '';
    const locationParam = searchParams.get('location') || '';
    
    setSearchQuery(queryParam);
    setLocation(locationParam);
  }, [searchParams]);

  // Use therapists data once loaded and apply initial filtering
  useEffect(() => {
    console.log('FindTherapists - Therapists data changed:', therapists.length);
    if (therapists.length > 0) {
      applyFilters(filters, searchQuery, location);
    } else {
      setFilteredTherapists([]);
    }
  }, [therapists, searchQuery, location]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTherapists.length / THERAPISTS_PER_PAGE);
  const startIndex = (currentPage - 1) * THERAPISTS_PER_PAGE;
  const endIndex = startIndex + THERAPISTS_PER_PAGE;
  const currentTherapists = filteredTherapists.slice(startIndex, endIndex);

  const handleSearch = (query: string, loc: string) => {
    console.log('FindTherapists - Search triggered:', { query, loc });
    setSearchQuery(query);
    setLocation(loc);
    
    // Update URL parameters
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (loc.trim()) params.set('location', loc.trim());
    setSearchParams(params);
    
    applyFilters(filters, query, loc);
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    console.log('FindTherapists - Filters changed:', newFilters);
    setFilters(newFilters);
    applyFilters(newFilters, searchQuery, location);
  };

  const applyFilters = (currentFilters: SearchFilters, query: string, loc: string) => {
    console.log('FindTherapists - Applying filters:', {
      totalTherapists: therapists.length,
      query,
      loc,
      filters: currentFilters
    });

    let filtered = [...therapists];

    // Search query filter - improved to handle array properties correctly
    if (query) {
      filtered = filtered.filter(therapist => {
        const nameMatch = therapist.name?.toLowerCase().includes(query.toLowerCase());
        const bioMatch = therapist.bio?.toLowerCase().includes(query.toLowerCase());
        
        // Handle specialties array properly - defensive programming
        const specialtyMatch = Array.isArray(therapist.specialties) && therapist.specialties.some(spec => 
          spec && spec.name && spec.name.toLowerCase().includes(query.toLowerCase())
        );
        
        // Handle approaches array properly - defensive programming
        const approachMatch = Array.isArray(therapist.approaches) && therapist.approaches.some(app => 
          app && app.name && app.name.toLowerCase().includes(query.toLowerCase())
        );

        return nameMatch || bioMatch || specialtyMatch || approachMatch;
      });
    }

    // Location filter
    if (loc) {
      filtered = filtered.filter(therapist => 
        therapist.location?.city?.toLowerCase().includes(loc.toLowerCase()) ||
        therapist.location?.state?.toLowerCase().includes(loc.toLowerCase())
      );
    }

    // Specialties filter - fix to work with new structure
    if (currentFilters.specialties.length > 0) {
      filtered = filtered.filter(therapist =>
        Array.isArray(therapist.specialties) && therapist.specialties.some(spec => 
          spec && currentFilters.specialties.includes(spec.id)
        )
      );
    }

    // Approaches filter - fix to work with new structure
    if (currentFilters.approaches.length > 0) {
      filtered = filtered.filter(therapist =>
        Array.isArray(therapist.approaches) && therapist.approaches.some(app => 
          app && currentFilters.approaches.includes(app.id)
        )
      );
    }

    // Price range filter
    if (currentFilters.priceRange) {
      filtered = filtered.filter(therapist =>
        therapist.pricePerSession >= currentFilters.priceRange.min &&
        therapist.pricePerSession <= currentFilters.priceRange.max
      );
    }

    // Session type filter
    if (currentFilters.sessionType !== 'both') {
      filtered = filtered.filter(therapist => {
        if (currentFilters.sessionType === 'online') {
          return therapist.location?.offersOnline;
        } else {
          return therapist.location?.offersInPerson;
        }
      });
    }

    // Rating filter
    if (currentFilters.rating > 0) {
      filtered = filtered.filter(therapist => therapist.rating >= currentFilters.rating);
    }

    // Languages filter
    if (currentFilters.languages.length > 0) {
      filtered = filtered.filter(therapist =>
        Array.isArray(therapist.languages) && currentFilters.languages.some(lang => therapist.languages.includes(lang))
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'price-low':
          return (a.pricePerSession || 0) - (b.pricePerSession || 0);
        case 'price-high':
          return (b.pricePerSession || 0) - (a.pricePerSession || 0);
        case 'experience':
          return (b.experience || 0) - (a.experience || 0);
        default:
          return (b.rating || 0) - (a.rating || 0);
      }
    });

    console.log('FindTherapists - Filter results:', {
      originalCount: therapists.length,
      filteredCount: filtered.length,
      hasResults: filtered.length > 0
    });

    setFilteredTherapists(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    console.log('FindTherapists - Clearing all filters');
    const clearedFilters: SearchFilters = {
      specialties: [],
      approaches: [],
      priceRange: { min: 0, max: 500 },
      sessionType: 'both',
      availability: {},
      rating: 0,
      languages: []
    };
    setFilters(clearedFilters);
    setSearchQuery('');
    setLocation('');
    setSearchParams(new URLSearchParams());
    setFilteredTherapists(therapists);
    setCurrentPage(1);
  };

  if (error) {
    console.error('FindTherapists - Render error:', error);
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-4">
              Erro ao carregar terapeutas. Tente novamente mais tarde.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Search Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Encontrar Terapeutas
            </h1>
            <p className="text-gray-600">
              {isLoading ? 'Carregando...' : `${filteredTherapists.length} profissionais encontrados`}
            </p>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                
                <SortSelect value={sortBy} onChange={setSortBy} />
              </div>
              
              <ViewToggle value={viewMode} onChange={setViewMode} />
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-pulse">
                  <div className="grid gap-6 mb-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : currentTherapists.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  {filteredTherapists.length === 0 && therapists.length === 0 
                    ? 'Nenhum terapeuta cadastrado ainda.' 
                    : 'Nenhum terapeuta encontrado com os filtros aplicados.'
                  }
                </p>
                {filteredTherapists.length === 0 && therapists.length > 0 && (
                  <Button onClick={clearFilters} variant="outline">
                    Limpar Filtros
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className={`grid gap-6 mb-8 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2' 
                    : 'grid-cols-1'
                }`}>
                  {currentTherapists.map((therapist) => (
                    <div key={therapist.id} className="animate-fade-in">
                      <TherapistCard therapist={therapist} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filtros</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <FilterSidebar 
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindTherapists;
