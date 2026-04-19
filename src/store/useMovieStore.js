import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useMovieStore = create(
  persist(
    (set) => ({
      // --- Transient State (NOT saved to local storage) ---
      searchQuery: '',
      activeGenre: null, // null means "Trending/All"

      // --- Persistent State (Saved to local storage) ---
      favorites: [], 
      userRatings: {}, 

      // --- Actions ---
      setSearchQuery: (query) => set({ 
        searchQuery: query, 
        activeGenre: null // Clearing genre when searching
      }),

      setActiveGenre: (genreId) => set({ 
        activeGenre: genreId, 
        searchQuery: '' // Clearing search when clicking a genre
      }),

      toggleFavorite: (movieId) => set((state) => {
        const isFav = state.favorites.includes(movieId);
        return {
          favorites: isFav 
            ? state.favorites.filter((id) => id !== movieId)
            : [...state.favorites, movieId]
        };
      }),

      setUserRating: (movieId, rating) => set((state) => ({
        userRatings: { ...state.userRatings, [movieId]: rating }
      })),
    }),
    {
      name: 'cineflow-storage', // The key used in browser LocalStorage
      // ONLY save favorites and userRatings. Forget search queries on refresh.
      partialize: (state) => ({ 
        favorites: state.favorites, 
        userRatings: state.userRatings 
      }),
    }
  )
);

export default useMovieStore;