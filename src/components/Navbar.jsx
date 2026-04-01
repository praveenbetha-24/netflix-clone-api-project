import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import "./Navbar.css";

const Navbar = ({ onSearch, activeSection, onSectionChange }) => {
    const { theme, toggleTheme, favorites } = useApp();
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (searchOpen) {
            inputRef.current?.focus();
            const handleClickOutside = (e) => {
                if (inputRef.current && !inputRef.current.contains(e.target) && !e.target.closest(".search-btn")) {
                    if (!query) setSearchOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [searchOpen, query]);

    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);
        onSearch(val);
    };

    const clearSearch = () => {
        setQuery("");
        onSearch("");
        inputRef.current?.focus();
    };

    const navLinks = [
        { id: "home", label: "Home" },
        { id: "trending", label: "Trending" },
        { id: "toprated", label: "Top Rated" },
        { id: "favorites", label: `❤ Favorites${favorites.length ? ` (${favorites.length})` : ""}` },
    ];

    return (
        <>
            <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
                <div className="nav-left">
                    <a className="logo" href="#" onClick={() => { onSectionChange("home"); onSearch(""); setQuery(""); }}>
                        <span className="logo-icon">🎬</span>
                        <span className="logo-text">MovieZap</span>
                    </a>
                    <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
                        {navLinks.map(({ id, label }) => (
                            <li key={id}>
                                <a
                                    href="#"
                                    className={activeSection === id ? "active" : ""}
                                    onClick={(e) => { e.preventDefault(); onSectionChange(id); setMenuOpen(false); }}
                                >
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="nav-right">
                    <div className={`nav-search ${searchOpen ? "open" : ""}`}>
                        <button className="icon-btn search-btn" onClick={() => setSearchOpen(s => !s)} aria-label="Search">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                            </svg>
                        </button>
                        <input
                            ref={inputRef}
                            type="text"
                            className="search-input"
                            value={query}
                            onChange={handleSearch}
                            onBlur={() => !query && setSearchOpen(false)}
                            placeholder="Titles, people, genres"
                        />
                        {query && (
                            <button className="clear-search-inline" onClick={clearSearch}>
                                ✕
                            </button>
                        )}
                    </div>
                    <button className="icon-btn theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
                        {theme === "dark" ? "☀️" : "🌙"}
                    </button>
                    <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(m => !m)} aria-label="Menu">
                        <span /><span /><span />
                    </button>
                </div>
            </nav>

        </>
    );
};

export default Navbar;
