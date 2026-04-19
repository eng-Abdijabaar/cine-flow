import { useEffect, useState } from 'react';
import { Search, Flame, Clapperboard, Rocket, TrendingUp } from 'lucide-react';
import useMovieStore from '../store/useMovieStore';
import { fetchTrending, searchMovies, fetchByGenre, getImageUrl } from '../api/tmdb';
import { Link } from 'react-router-dom';

// Added a "Trending" (null) category to act as the default home state
const CATEGORIES = [
  { id: null, name: "Trending", icon: <TrendingUp size={16} /> },
  { id: 28, name: "Action", icon: <Flame size={16} /> },
  { id: 878, name: "Sci-Fi", icon: <Rocket size={16} /> },
  { id: 35, name: "Comedy", icon: <Clapperboard size={16} /> },
];

export default function Home() {
  // Pull our new activeGenre and setActiveGenre from the store
  const { searchQuery, setSearchQuery, activeGenre, setActiveGenre } = useMovieStore();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      let response;
      
      // Logic Tree: Decide which API endpoint to hit
      if (searchQuery) {
        response = await searchMovies(searchQuery);
      } else if (activeGenre) {
        response = await fetchByGenre(activeGenre);
      } else {
        response = await fetchTrending();
      }
      
      setMovies(response.data.results);
    };

    const debounce = setTimeout(loadMovies, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery, activeGenre]); // <-- Now triggers when EITHER of these change

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
        {CATEGORIES.map((cat) => {
          // Check if this specific tab is the active one
          const isActive = activeGenre === cat.id;

          return (
            <button 
              key={cat.id || 'trending'} 
              onClick={() => setActiveGenre(cat.id)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all whitespace-nowrap border ${
                isActive 
                  ? 'bg-brand-orange text-white border-brand-orange shadow-lg shadow-brand-orange/20' 
                  : 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="group relative rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300">
            <img src={getImageUrl(movie.poster_path)} alt={movie.title} className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white leading-tight">{movie.title}</h3>
              <p className="text-brand-orange text-sm font-medium mt-1">
                {movie.release_date?.split('-')[0]}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}