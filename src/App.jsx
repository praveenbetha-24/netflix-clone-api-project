import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Controls from "./components/Controls";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";
import Skeleton from "./components/Skeleton";
import { useApp } from "./context/AppContext";
import {
  fetchGenres,
  fetchDiscover,
  fetchTrending,
  fetchTopRated,
  fetchByGenre,
  searchMovies,
} from "./services/tmdb";
import "./App.css";

// Debounce helper
const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

// Toast helper
const Toast = ({ msg }) =>
  msg ? <div className={`toast show`}>{msg}</div> : <div className="toast" />;

export default function App() {
  const { theme, favorites } = useApp();

  // UI State
  const [activeSection, setActiveSection] = useState("home"); // home|trending|toprated|favorites
  const [view, setView] = useState("grid");
  const [selectedModal, setSelectedModal] = useState(null);
  const [showBackTop, setShowBackTop] = useState(false);
  const [toast, setToast] = useState("");

  // Filter/Sort state
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 450);

  // Movie data state
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalResults, setTotalResults] = useState(null);

  // Load genres once
  useEffect(() => {
    fetchGenres()
      .then(d => setGenres(d.genres || []))
      .catch(console.error);
  }, []);

  // Scroll events
  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── FETCH MOVIES ──────────────────────────────────────────
  const fetchPageMovies = useCallback(async (pg, append = false) => {
    if (activeSection === "favorites") return;

    append ? setLoadingMore(true) : setLoading(true);

    try {
      let data;
      if (debouncedQuery.trim()) {
        data = await searchMovies(debouncedQuery, pg);
      } else if (activeSection === "trending") {
        data = await fetchTrending(pg);
      } else if (activeSection === "toprated") {
        data = await fetchTopRated(pg);
      } else if (selectedGenre) {
        data = await fetchByGenre(selectedGenre, sortBy, pg);
      } else {
        data = await fetchDiscover(sortBy, pg);
      }

      const results = data.results || [];
      setTotalPages(data.total_pages || 1);
      setTotalResults(data.total_results || null);

      // Client-side sort when not using discover (trending/toprated/search already sorted by API)
      const sorted = debouncedQuery || activeSection !== "home"
        ? results
        : sortClientSide(results, sortBy);

      setMovies(prev => append ? [...prev, ...sorted] : sorted);
    } catch (err) {
      console.error(err);
      showToast("⚠️ Failed to load movies. Check your API key.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeSection, debouncedQuery, selectedGenre, sortBy]);

  // Refetch on filter/search/section changes
  useEffect(() => {
    setPage(1);
    setMovies([]);
    fetchPageMovies(1, false);
  }, [activeSection, debouncedQuery, selectedGenre, sortBy]);

  // Load more
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPageMovies(nextPage, true);
  };

  // ── SORT (client-side fallback) ───────────────────────────
  const sortClientSide = (list, method) => {
    return [...list].sort((a, b) => {
      switch (method) {
        case "vote_average.desc": return b.vote_average - a.vote_average;
        case "vote_average.asc": return a.vote_average - b.vote_average;
        case "release_date.desc": return new Date(b.release_date) - new Date(a.release_date);
        case "release_date.asc": return new Date(a.release_date) - new Date(b.release_date);
        default: return b.popularity - a.popularity;
      }
    });
  };

  // ── TOAST ─────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ── SECTION LABELS ────────────────────────────────────────
  const sectionMeta = {
    home: { title: "🎬 Explore Movies", icon: "" },
    trending: { title: "🔥 Trending This Week", icon: "" },
    toprated: { title: "⭐ Top Rated", icon: "" },
    favorites: { title: "❤ My Favorites", icon: "" },
  };

  const displayMovies = activeSection === "favorites"
    ? sortClientSide(favorites, sortBy)
    : movies;

  const displayCount = activeSection === "favorites"
    ? favorites.length
    : totalResults;

  const showLoadMore =
    activeSection !== "favorites"
    && !debouncedQuery
    && page < totalPages
    && !loading;

  return (
    <div className="app">
      {/* Navbar */}
      <Navbar
        onSearch={setSearchQuery}
        activeSection={activeSection}
        onSectionChange={(s) => {
          setActiveSection(s);
          setSearchQuery("");
          setSelectedGenre("");
        }}
      />

      {/* Hero – only on Home with no search/genre */}
      {activeSection === "home" && !debouncedQuery && !selectedGenre && (
        <Hero onMovieClick={setSelectedModal} />
      )}

      {/* Main content */}
      <main className={`main ${activeSection === "home" && !debouncedQuery && !selectedGenre ? "" : "no-hero"}`}>
        <Controls
          genres={genres}
          selectedGenre={selectedGenre}
          sortBy={sortBy}
          onGenreChange={(g) => { setSelectedGenre(g); setActiveSection("home"); }}
          onSortChange={setSortBy}
          view={view}
          onViewChange={setView}
          title={
            debouncedQuery
              ? `🔍 Results for "${debouncedQuery}"`
              : sectionMeta[activeSection]?.title
          }
          resultCount={displayCount}
        />

        {/* MovieGrid */}
        {loading ? (
          <Skeleton count={12} view={view} />
        ) : displayMovies.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🎬</div>
            <h3>No movies found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={`movies-grid ${view === "list" ? "list-mode" : ""}`}>
            {displayMovies.map((movie, i) => (
              <MovieCard
                key={`${movie.id}-${i}`}
                movie={movie}
                onMovieClick={setSelectedModal}
                genres={genres}
              />
            ))}
          </div>
        )}

        {/* Load more */}
        {showLoadMore && (
          <div className="load-more-wrap">
            <button
              className="btn-load-more"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </main>

      {/* Movie Modal */}
      {selectedModal && (
        <MovieModal movie={selectedModal} onClose={() => setSelectedModal(null)} />
      )}

      {/* Toast */}
      <Toast msg={toast} />

      {/* Back to top */}
      <button
        className={`back-to-top ${showBackTop ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑
      </button>

      <footer>
        <p>
          Built with ❤️ using{" "}
          <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
            TMDb API
          </a>{" "}
          · MovieZap © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
