import React from "react";
import ImageCard from "./ImageCard";
import SkeletonCard from "./SkeletonCard";

const ImageGrid = ({
  images,
  loading,
  error,
  onDownload,
  onResetSearch,
  onSelect,
}) => {
  // Render shimmer skeleton cards when loading and no images are present
  if (loading && images.length === 0) {
    return (
      <div className="grid-container" aria-label="Loading archival photos">
        {Array.from({ length: 9 }).map((_, index) => (
          <SkeletonCard key={`skeleton-${index}`} index={index} />
        ))}
      </div>
    );
  }

  // Render a editorial-styled error card if request failures occur
  if (error) {
    return (
      <div className="error-state" role="alert">
        <h2 className="error-state-title">Archive Offline</h2>
        <p className="error-state-text">
          {error}. This typically occurs when the API rate limit has been
          exceeded, or your internet connection is unstable.
        </p>
        <button
          className="action-link"
          onClick={onResetSearch}
          style={{ background: "none", border: "none" }}
        >
          RETURN TO HOME ARCHIVE
        </button>
      </div>
    );
  }

  // Render an editorial empty state when search returns no matches
  if (!loading && (!images || images.length === 0)) {
    return (
      <div className="empty-state">
        <h2 className="empty-state-title">No Archives Found</h2>
        <p className="empty-state-text">
          Our catalog returned zero negatives matching your current search
          parameters. Please try a different query or restore home grid.
        </p>
        <button
          className="action-link"
          onClick={onResetSearch}
          style={{ background: "none", border: "none" }}
        >
          RESTORE HOME PORTFOLIO
        </button>
      </div>
    );
  }

  // Render the masonry grid with photo cards
  return (
    <div className="grid-container" aria-live="polite">
      {images.map((photo, index) => (
        <ImageCard
          key={photo.id || index}
          photo={photo}
          index={index}
          onDownload={onDownload}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default ImageGrid;
