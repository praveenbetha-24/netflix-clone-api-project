import "./Skeleton.css";

const Skeleton = ({ count = 8, view = "grid" }) => {
    return (
        <div className={`movies-grid ${view === "list" ? "list-mode" : ""}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={`skeleton-card ${view === "list" ? "skeleton-list" : ""}`}>
                    <div className="skeleton-poster" />
                    <div className="skeleton-body">
                        <div className="skeleton-line w80" />
                        <div className="skeleton-line w50" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Skeleton;
