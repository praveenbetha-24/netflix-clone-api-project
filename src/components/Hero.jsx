import { useState, useEffect } from "react";
import { fetchTrending } from "../services/tmdb";
import { IMG_ORIG, IMG_BASE } from "../services/tmdb";
import { useApp } from "../context/AppContext";
import "./Hero.css";

const Hero = ({ onMovieClick }) => {
    const [movies, setMovies] = useState([]);
    const [current, setCurrent] = useState(0);
    const { toggleFavorite, isFavorite } = useApp();

    useEffect(() => {
        fetchTrending(1)
            .then(data => setMovies(data.results.slice(0, 6)))
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (movies.length === 0) return;
        const timer = setInterval(() => setCurrent(c => (c + 1) % movies.length), 7000);
        return () => clearInterval(timer);
    }, [movies]);

    const movie = movies[current];
    if (!movie) return <div className="hero hero-skeleton" />;

    const bg = movie.backdrop_path ? `${IMG_ORIG}${movie.backdrop_path}` : "";
    const year = movie.release_date?.split("-")[0] || "N/A";
    const rating = movie.vote_average?.toFixed(1);
    const fav = isFavorite(movie.id);

    return (
        <section className="hero">
            <div
                className="hero-backdrop"
                style={{ backgroundImage: bg ? `url(${bg})` : "none" }}
                key={movie.id}
            />
            <div className="hero-gradient" />

            <div className="hero-content">
                <span className="hero-badge">🔥 Trending Now</span>
                <h1 className="hero-title">{movie.title}</h1>
                <p className="hero-overview">{movie.overview}</p>
                <div className="hero-meta">
                    <span className="hero-tag rating">⭐ {rating}</span>
                    <span className="hero-tag year">{year}</span>
                    {movie.adult && <span className="hero-tag r">18+</span>}
                </div>
                <div className="hero-buttons">
                    <button className="btn-play" onClick={() => onMovieClick(movie)}>▶ More Info</button>
                    <button
                        className={`btn-fav-hero ${fav ? "active" : ""}`}
                        onClick={() => toggleFavorite(movie)}
                    >
                        {fav ? "❤ Saved" : "🤍 Favorite"}
                    </button>
                </div>
            </div>

            {/* Dots */}
            <div className="hero-dots">
                {movies.map((_, i) => (
                    <button
                        key={i}
                        className={`dot ${i === current ? "active" : ""}`}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;
