import { useApp } from "../context/AppContext";
import { IMG_BASE } from "../services/tmdb";
import "./MovieCard.css";

const MovieCard = ({ movie, onMovieClick, genres = [] }) => {
    const { toggleFavorite, isFavorite } = useApp();
    const fav = isFavorite(movie.id);

    const poster = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : null;
    const year = movie.release_date?.split("-")[0] || "N/A";
    const rating = movie.vote_average?.toFixed(1);

    // Map genre IDs → names
    const movieGenres = (movie.genre_ids || [])
        .slice(0, 2)
        .map(id => genres.find(g => g.id === id)?.name)
        .filter(Boolean)
        .join(" · ");

    const handleFav = (e) => {
        e.stopPropagation();
        toggleFavorite(movie);
    };

    return (
        <div className="movie-card" onClick={() => onMovieClick(movie)}>
            {/* Poster */}
            <div className="card-poster-wrap">
                {poster ? (
                    <img className="card-poster" src={poster} alt={movie.title} loading="lazy" />
                ) : (
                    <div className="card-no-poster">
                        <span className="movie-icon">🎬</span>
                        <span>No Image</span>
                    </div>
                )}

                {/* Hover overlay */}
                <div className="card-overlay">
                    <span className="overlay-play">▶</span>
                </div>

                {/* Rating badge */}
                {rating && <span className="card-rating">⭐ {rating}</span>}

                {/* Fav button */}
                <button
                    className={`card-fav-btn ${fav ? "active" : ""}`}
                    onClick={handleFav}
                    aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                    title={fav ? "Remove from favorites" : "Add to favorites"}
                >
                    {fav ? "❤" : "🤍"}
                </button>
            </div>

            {/* Card Body */}
            <div className="card-body">
                <h3 className="card-title" title={movie.title}>{movie.title}</h3>
                <div className="card-meta">
                    <span className="card-year">{year}</span>
                    <span className="card-votes">{movie.vote_count?.toLocaleString()} votes</span>
                </div>
                {movieGenres && <p className="card-genres">{movieGenres}</p>}
            </div>
        </div>
    );
};

export default MovieCard;
