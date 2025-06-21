
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('therapist-favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        setFavorites([]);
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('therapist-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (therapistId: string) => {
    return favorites.includes(therapistId);
  };

  const addToFavorites = (therapistId: string) => {
    setFavorites(prev => {
      if (prev.includes(therapistId)) {
        return prev;
      }
      const newFavorites = [...prev, therapistId];
      toast.success('Terapeuta adicionado aos favoritos!');
      return newFavorites;
    });
  };

  const removeFromFavorites = (therapistId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(id => id !== therapistId);
      toast.success('Terapeuta removido dos favoritos!');
      return newFavorites;
    });
  };

  const toggleFavorite = (therapistId: string) => {
    if (isFavorite(therapistId)) {
      removeFromFavorites(therapistId);
    } else {
      addToFavorites(therapistId);
    }
  };

  return {
    favorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
  };
};
