
const API_KEY = "49fc293f7d5c6a526e14c7d5191ad0e4";
const BASE_URL = "https://api.themoviedb.org/3";

export const IMG_BASE = "https://image.tmdb.org/t/p/w500";
export const IMG_ORIG = "https://image.tmdb.org/t/p/original";
export const IMG_W300 = "https://image.tmdb.org/t/p/w300";

const get = async (endpoint, params = {}) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.set("api_key", API_KEY);
    Object.entries(params).forEach(([k, v]) => v && url.searchParams.set(k, v));
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`TMDb error ${res.status}`);
    return res.json();
};

// Endpoints
export const fetchTrending = (page = 1) => get("/trending/movie/week", { page });
export const fetchPopular = (page = 1) => get("/movie/popular", { page });
export const fetchTopRated = (page = 1) => get("/movie/top_rated", { page });
export const fetchGenres = () => get("/genre/movie/list");
export const fetchMovieDetail = (id) => get(`/movie/${id}`, { append_to_response: "videos,credits" });
export const searchMovies = (query, page = 1) => get("/search/movie", { query, page });
export const fetchByGenre = (genreId, sortBy = "popularity.desc", page = 1) =>
    get("/discover/movie", { with_genres: genreId, sort_by: sortBy, page });
export const fetchDiscover = (sortBy = "popularity.desc", page = 1) =>
    get("/discover/movie", { sort_by: sortBy, page, "vote_count.gte": 50 });
