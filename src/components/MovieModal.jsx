import { useState, useEffect } from "react";
import { fetchMovieDetail, IMG_ORIG, IMG_BASE } from "../services/tmdb";
import { useApp } from "../context/AppContext";
import "./MovieModal.css";

const MovieModal = ({ movie, onClose }) => {
    const [detail, setDetail] = useState(null);
    const { toggleFavorite, isFavorite } = useApp();
    const fav = movie ? isFavorite(movie.id) : false;

    useEffect(() => {
        if (!movie) return;
        setDetail(null);
        fetchMovieDetail(movie.id).then(setDetail).catch(console.error);
    }, [movie]);

    useEffect(() => {
        if (movie) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [movie]);

    // Close on ESC
    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    if (!movie) return null;

    const backdrop = movie.backdrop_path ? `${IMG_ORIG}${movie.backdrop_path}` : "";
    const poster = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : null;
    const year = movie.release_date?.split("-")[0] || "N/A";
    const rating = movie.vote_average?.toFixed(1);

    const genres = detail?.genres?.map(g => g.name).join(", ") || "N/A";
    const runtime = detail?.runtime ? `${Math.floor(detail.runtime / 60)}h ${detail.runtime % 60}m` : "N/A";
    const director = detail?.credits?.crew?.find(c => c.job === "Director")?.name || "N/A";
    const cast = detail?.credits?.cast?.slice(0, 5).map(a => a.name).join(", ") || "N/A";
    const trailer = detail?.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");

    return (
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal" role="dialog" aria-modal="true" aria-label={movie.title}>
                {/* Backdrop image */}
                <div className="modal-backdrop" style={{ backgroundImage: backdrop ? `url(${backdrop})` : "none" }} />
                <div className="modal-gradient" />

                {/* Close */}
                <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

                <div className="modal-content">
                    {/* Poster */}
                    {poster && (
                        <div className="modal-poster-wrap">
                            <img className="modal-poster" src={poster} alt={movie.title} />
                        </div>
                    )}

                    {/* Info */}
                    <div className="modal-info">
                        <h2 className="modal-title">{movie.title}</h2>

                        <div className="modal-badges">
                            <span className="modal-badge rating">⭐ {rating}</span>
                            <span className="modal-badge year">{year}</span>
                            {detail?.genres?.slice(0, 3).map(g => (
                                <span key={g.id} className="modal-badge genre">{g.name}</span>
                            ))}
                            {movie.adult && <span className="modal-badge r-rated">18+</span>}
                        </div>

                        <p className="modal-overview">{movie.overview || "No description available."}</p>

                        {detail ? (
                            <div className="modal-details">
                                <div className="detail-item"><span className="detail-label">Runtime</span><span className="detail-value">{runtime}</span></div>
                                <div className="detail-item"><span className="detail-label">Director</span><span className="detail-value">{director}</span></div>
                                <div className="detail-item"><span className="detail-label">Cast</span><span className="detail-value">{cast}</span></div>
                                <div className="detail-item"><span className="detail-label">Language</span><span className="detail-value">{movie.original_language?.toUpperCase()}</span></div>
                                <div className="detail-item"><span className="detail-label">Votes</span><span className="detail-value">{movie.vote_count?.toLocaleString()}</span></div>
                                <div className="detail-item"><span className="detail-label">Status</span><span className="detail-value">{detail.status}</span></div>
                            </div>
                        ) : (
                            <div className="detail-loading">Loading details...</div>
                        )}

                        <div className="modal-actions">
                            {trailer && (
                                <a
                                    href={`https://youtube.com/watch?v=${trailer.key}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-play small"
                                >
                                    ▶ Watch Trailer
                                </a>
                            )}
                            <button
                                className={`btn-fav-modal ${fav ? "active" : ""}`}
                                onClick={() => toggleFavorite(movie)}
                            >
                                {fav ? "❤ Saved" : "🤍 Add to Favorites"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieModal;
