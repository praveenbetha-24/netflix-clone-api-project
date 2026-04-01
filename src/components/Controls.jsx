import "./Controls.css";

const SORT_OPTIONS = [
    { value: "popularity.desc", label: "Most Popular" },
    { value: "vote_average.desc", label: "Highest Rated" },
    { value: "vote_average.asc", label: "Lowest Rated" },
    { value: "release_date.desc", label: "Newest First" },
    { value: "release_date.asc", label: "Oldest First" },
];

const Controls = ({ genres, selectedGenre, sortBy, onGenreChange, onSortChange, view, onViewChange, title, resultCount }) => {
    return (
        <div className="controls-bar">
            <div className="controls-left">
                <h2 className="section-title">{title}</h2>
                {typeof resultCount === "number" && (
                    <span className="result-count">{resultCount.toLocaleString()} movies</span>
                )}
            </div>

            <div className="controls-right">
                {/* Genre filter */}
                <div className="filter-group">
                    <label htmlFor="genreFilter">Genre</label>
                    <select id="genreFilter" value={selectedGenre} onChange={e => onGenreChange(e.target.value)}>
                        <option value="">All Genres</option>
                        {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                </div>

                {/* Sort */}
                <div className="filter-group">
                    <label htmlFor="sortBy">Sort By</label>
                    <select id="sortBy" value={sortBy} onChange={e => onSortChange(e.target.value)}>
                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>

                {/* View toggle */}
                <div className="filter-group">
                    <label>View</label>
                    <div className="view-toggle">
                        <button className={`view-btn ${view === "grid" ? "active" : ""}`} onClick={() => onViewChange("grid")} aria-label="Grid view">
                            <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                        </button>
                        <button className={`view-btn ${view === "list" ? "active" : ""}`} onClick={() => onViewChange("list")} aria-label="List view">
                            <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="2" /><rect x="3" y="11" width="18" height="2" /><rect x="3" y="18" width="18" height="2" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Controls;
