import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ onSearch, currentSearchQuery }) => {
  const [inputValue, setInputValue] = useState(currentSearchQuery || "");

  // Keep internal input value aligned with external search query changes
  useEffect(() => {
    setInputValue(currentSearchQuery || "");
  }, [currentSearchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue("");
    onSearch(""); // Reset search to trigger initial photos load
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <Search className="search-icon-left" />
        <input
          type="text"
          className="search-input"
          placeholder="SEARCH ARCHIVE..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {inputValue && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search input"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <button type="submit" className="search-button">
        <span>FETCH</span>
      </button>
    </form>
  );
};

export default SearchBar;
