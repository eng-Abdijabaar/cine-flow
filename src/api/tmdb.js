import axios from 'axios';

const API_KEY = 'use yours';
const BASE_URL = 'https://api.themoviedb.org/3';

// axios instance
const api = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

//api requests
export const fetchTrending = () => api.get('/trending/movie/week');
export const searchMovies = (query) => api.get('/search/movie', { params: { query } });
export const fetchMovieDetails = (id) => api.get(`/movie/${id}`, { 
  params: { append_to_response: 'videos,images' } 
});
export const fetchByGenre = (genreId) => api.get('/discover/movie', { params: { with_genres: genreId } });

// Helper to get image URL
export const getImageUrl = (path, size = 'w500') => 
  path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder.jpg';
