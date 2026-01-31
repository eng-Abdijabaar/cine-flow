import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useMovieStore = create(
  persist(
    (set) => ({
      searchQuery: '',
      favorites: [], // Array of Movie IDs
      userRatings: {}, // Object: { [movieId]: rating }

      setSearchQuery: (query) => set({ searchQuery: query }),
      
      toggleFavorite: (movieId) => set((state) => {
        const isFav = state.favorites.includes(movieId);
        return {
          favorites: isFav 
            ? state.favorites.filter(id => id !== movieId)
            : [...state.favorites, movieId]
        };
      }),

      setUserRating: (movieId, rating) => set((state) => ({
        userRatings: { ...state.userRatings, [movieId]: rating }
      })),
    }),
    {
      name: 'cineflow-storage', // Persist data to localStorage
    }
  )
);

export default useMovieStore;