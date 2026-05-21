import React, { useState, useEffect } from "react";
import { Sliders } from "lucide-react";
import SearchBar from "./components/SearchBar";
import ImageGrid from "./components/ImageGrid";
import ToastContainer from "./components/Toast";
import ExhibitionModal from "./components/ExhibitionModal";
import "./App.css";

const PLACEHOLDER_ACCESS_KEY = import.meta.env.VITE_ETHEREAL_ACCESS_KEY;

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL");

  const CATEGORIES = [
    "ALL",
    "LANDSCAPES",
    "ARCHITECTURE",
    "STREETS",
    "PORTRAITS",
    "MINIMAL",
  ];

  const [accessKey, setAccessKey] = useState(() => {
    return (
      localStorage.getItem("unsplash_access_key") || PLACEHOLDER_ACCESS_KEY
    );
  });

  const [inputKey, setInputKey] = useState(accessKey);

  useEffect(() => {
    fetchImages(searchQuery);
  }, [searchQuery, accessKey]);

  const fetchImages = async (query = "") => {
    setLoading(true);
    setError(null);

    const activeKey = accessKey.trim();

    // If no key, show prompt error instead of mock data
    if (!activeKey) {
      setError(
        "Please configure a valid Unsplash Developer Access Key to fetch gallery images.",
      );
      setImages([]);
      setLoading(false);
      return;
    }

    try {
      let endpoint = "";
      if (query) {
        endpoint = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=24&auto=format&fit=crop&w=500&client_id=${activeKey}`;
      } else {
        endpoint = `https://api.unsplash.com/photos?per_page=24&auto=format&fit=crop&w=500&client_id=${activeKey}`;
      }

      const response = await fetch(endpoint);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "API Rate Limit Exceeded (50 reqs/hr). Please try again later.",
          );
        }
        throw new Error(`API answered with status ${response.status}`);
      }

      const data = await response.json();
      const resolvedPhotos = query ? data.results : data;

      setImages(resolvedPhotos || []);
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError(
        err.message || "Network error occurred while fetching archives.",
      );
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setActiveCategory("ALL");
    setSearchQuery(query);
  };

  const handleResetSearch = () => {
    setActiveCategory("ALL");
    setSearchQuery("");
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSearchQuery("");

    if (category === "ALL") {
      fetchImages("");
    } else {
      const map = {
        LANDSCAPES: "landscape",
        ARCHITECTURE: "architecture",
        STREETS: "street",
        PORTRAITS: "portrait",
        MINIMAL: "minimal",
      };
      fetchImages(map[category]);
    }
  };

  const handleSaveAccessKey = (e) => {
    e.preventDefault();
    const formattedKey = inputKey.trim();
    setAccessKey(formattedKey);
    localStorage.setItem("unsplash_access_key", formattedKey);
    setShowSettings(false);

    triggerToast(
      formattedKey ? "Unsplash Access Key saved" : "Unsplash Key reset",
    );
  };

  const triggerToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleSelectPhoto = (photo, index) => {
    setSelectedPhoto(photo);
    setSelectedPhotoIndex(index);
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
    setSelectedPhotoIndex(null);
  };

  const handlePrevPhoto = () => {
    if (images.length === 0 || selectedPhotoIndex === null) return;
    const newIndex = (selectedPhotoIndex - 1 + images.length) % images.length;
    setSelectedPhotoIndex(newIndex);
    setSelectedPhoto(images[newIndex]);
  };

  const handleNextPhoto = () => {
    if (images.length === 0 || selectedPhotoIndex === null) return;
    const newIndex = (selectedPhotoIndex + 1) % images.length;
    setSelectedPhotoIndex(newIndex);
    setSelectedPhoto(images[newIndex]);
  };

  return (
    <div className="app-container">
      <div className="ambient-glow"></div>

      <header className="app-header">
        <div className="header-content">
          <div className="header-title-container">
            <a
              href="/"
              className="header-title"
              onClick={(e) => {
                e.preventDefault();
                handleResetSearch();
              }}
            >
              ETHEREAL<span>.</span>
            </a>
            <span className="header-subtitle">
              Editorial Photography Archive
            </span>
          </div>

          <div className="header-controls">
            <SearchBar
              onSearch={handleSearch}
              currentSearchQuery={searchQuery}
            />

            <button
              className="settings-toggle-btn"
              onClick={() => setShowSettings(!showSettings)}
              title="Configure Unsplash Access Key"
              aria-label="API Settings"
            >
              <Sliders size={16} />
            </button>

            {showSettings && (
              <div className="api-settings-panel">
                <h3>ACCESS KEY PANEL</h3>
                <p>
                  Paste your Unsplash Developer Access Key. Settings are cached
                  securely in your local browser sandbox.
                </p>
                <form onSubmit={handleSaveAccessKey}>
                  <div className="api-input-wrapper">
                    <input
                      type="password"
                      className="api-input"
                      placeholder="UNSPLASH_ACCESS_KEY"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      autoComplete="off"
                    />
                    <button type="submit" className="api-save-btn">
                      SAVE
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Error display banner if API key is missing or limit exceeded */}
      {error && (
        <div
          className="api-alert-banner"
          style={{ background: "rgba(211, 47, 47, 0.2)", color: "#ff6b6b" }}
        >
          {error}{" "}
          <span
            onClick={() => setShowSettings(true)}
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              marginLeft: "5px",
            }}
          >
            Open Key Panel
          </span>
        </div>
      )}

      <section className="exhibition-hero">
        <div className="hero-meta-strip">
          <div className="hero-meta-item">
            ROTATION STATUS: <span>ONLINE</span>
          </div>
          <div className="hero-meta-item">
            CURATED ARCHIVE ED. <span>2026</span>
          </div>
          <div className="hero-meta-item">
            SYS NODE: <span>PRODUCTION</span>
          </div>
        </div>

        <div className="hero-title-group">
          <h1 className="hero-title-main">
            THE ART OF OBSERVING.
            <span>EXHIBITION ROTATION 01</span>
          </h1>
        </div>
      </section>

      <div className="filter-bar-container">
        <div className="category-tags">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`tag-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="gallery-results-count-premium">
          {loading ? (
            "CATALOGING ARCHIVES..."
          ) : (
            <span>{images.length} NEGATIVE(S) RESOLVED</span>
          )}
        </div>
      </div>

      <main className="gallery-main" style={{ paddingTop: "1rem" }}>
        <ImageGrid
          images={images}
          loading={loading}
          error={error}
          onDownload={triggerToast}
          onResetSearch={handleResetSearch}
          onSelect={handleSelectPhoto}
        />
      </main>

      {selectedPhoto && (
        <ExhibitionModal
          photo={selectedPhoto}
          onClose={handleClosePhoto}
          onPrev={handlePrevPhoto}
          onNext={handleNextPhoto}
          onDownload={triggerToast}
          triggerToast={triggerToast}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
