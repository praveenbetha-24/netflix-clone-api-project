import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    // Theme
    const [theme, setTheme] = useState(() => localStorage.getItem("mz_theme") || "dark");

    // Favorites
    const [favorites, setFavorites] = useState(() => {
        try { return JSON.parse(localStorage.getItem("mz_favorites")) || []; }
        catch { return []; }
    });

    // Persist
    useEffect(() => { localStorage.setItem("mz_theme", theme); document.documentElement.setAttribute("data-theme", theme); }, [theme]);
    useEffect(() => { localStorage.setItem("mz_favorites", JSON.stringify(favorites)); }, [favorites]);

    const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

    const toggleFavorite = useCallback((movie) => {
        setFavorites(prev => {
            const exists = prev.some(m => m.id === movie.id);
            return exists ? prev.filter(m => m.id !== movie.id) : [movie, ...prev];
        });
    }, []);

    const isFavorite = useCallback((id) => favorites.some(m => m.id === id), [favorites]);

    return (
        <AppContext.Provider value={{ theme, toggleTheme, favorites, toggleFavorite, isFavorite }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
