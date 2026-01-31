import { useEffect, useState } from 'react';
import { Search, Flame, Clapperboard, Rocket } from 'lucide-react';
import useMovieStore from '../store/useMovieStore';
import { fetchTrending, searchMovies, getImageUrl } from '../api/tmdb';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { id: 28, name: "Action", icon: <Flame size={16} /> },
  { id: 878, name: "Sci-Fi", icon: <Rocket size={16} /> },
  { id: 35, name: "Comedy", icon: <Clapperboard size={16} /> },
  // Add more genres as needed
];

export default function Home() {
  const { searchQuery, setSearchQuery } = useMovieStore();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      const { data } = searchQuery ? await searchMovies(searchQuery) : await fetchTrending();
      setMovies(data.results);
    };
    const debounce = setTimeout(loadMovies, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  return (
    <div className="min-h-screen p-6">
      {/* Hero Section */}
      <div className="relative mb-12 flex flex-col items-center justify-center text-center space-y-6 mt-10">
        <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
          Discover <span className="text-brand-blue">CineFlow</span>
        </h1>
        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
          <input 
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-full py-4 pl-12 pr-6 text-white outline-none focus:ring-2 focus:ring-brand-blue transition-all shadow-xl"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide mb-8">
        {CATEGORIES.map((cat) => (
          <button key={cat.id} className="flex items-center gap-2 px-6 py-2 rounded-full bg-slate-800 hover:bg-brand-orange hover:text-white transition-all whitespace-nowrap border border-slate-700">
            {cat.icon}
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="group relative rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300">
            <img src={getImageUrl(movie.poster_path)} alt={movie.title} className="w-full h-full object-cover" />
            
            {/* Glassmorphism Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white">{movie.title}</h3>
              <p className="text-brand-orange text-sm">{movie.release_date?.split('-')[0]}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}