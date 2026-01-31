import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Share2, Heart } from 'lucide-react';
import useMovieStore from '../store/useMovieStore';
import { fetchMovieDetails, getImageUrl } from '../api/tmdb';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const { favorites, toggleFavorite, userRatings, setUserRating } = useMovieStore();

  useEffect(() => {
    fetchMovieDetails(id).then(res => setMovie(res.data));
  }, [id]);

  if (!movie) return <div className="text-center mt-20">Loading...</div>;

  // Find trailer
  const trailer = movie.videos?.results.find(v => v.type === "Trailer" && v.site === "YouTube");
  const isFav = favorites.includes(Number(id));
  const currentRating = userRatings[id] || 0;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: movie.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  return (
    <div className="pb-20">
      {/* Hero Video Header */}
      <div className="relative w-full h-[50vh] lg:h-[70vh] bg-black">
        {trailer ? (
          <iframe
            className="w-full h-full opacity-60 pointer-events-none"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}`}
            allow="autoplay; encrypted-media"
          />
        ) : (
          <img src={getImageUrl(movie.backdrop_path, 'original')} className="w-full h-full object-cover opacity-50" />
        )}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-brand-dark to-transparent h-40" />
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <img src={getImageUrl(movie.poster_path)} className="w-64 rounded-xl shadow-2xl border-4 border-slate-800" />
          
          <div className="flex-1 space-y-6 pt-10">
            <h1 className="text-4xl md:text-6xl font-bold">{movie.title}</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <span>{movie.release_date}</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full"/>
              <span>{movie.runtime} min</span>
            </div>
            <p className="text-lg leading-relaxed text-gray-300">{movie.overview}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-6">
              <button 
                onClick={() => toggleFavorite(movie.id)}
                className={`p-3 rounded-full border transition-all ${isFav ? 'bg-red-500 border-red-500 text-white' : 'border-slate-600 hover:bg-slate-800'}`}
              >
                <Heart fill={isFav ? "currentColor" : "none"} />
              </button>
              
              <button onClick={handleShare} className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors">
                <Share2 size={18} /> Share
              </button>
            </div>

            {/* Rating System */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Rate this Movie</h3>
              <div className="flex gap-2">
                {[...Array(10)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={24} 
                    className={`cursor-pointer transition-colors ${i < currentRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                    onClick={() => setUserRating(movie.id, i + 1)}
                  />
                ))}
                <span className="ml-2 text-xl font-bold text-white">{currentRating}/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Masonry Gallery */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-brand-blue pl-4">Gallery</h2>
          {/* Tailwind v4 Masonry using columns */}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {movie.images?.backdrops.slice(0, 12).map((img, idx) => (
              <div key={idx} className="break-inside-avoid rounded-lg overflow-hidden shadow-lg hover:opacity-90 transition-opacity">
                <img src={getImageUrl(img.file_path)} className="w-full" alt="Movie still" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}