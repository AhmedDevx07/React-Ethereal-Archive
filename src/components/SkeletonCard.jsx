import React from "react";

const SkeletonCard = ({ index }) => {
  // Generate a varied height span based on index for masonry skeleton simulation
  const heights = [21, 25, 23, 26, 19, 22];
  const span = heights[index % heights.length];

  return (
    <div
      className="skeleton-card"
      style={{
        gridRowEnd: `span ${span}`,
        aspectRatio:
          span === 22 || span === 23 ? "1/1" : span > 24 ? "3/4" : "4/3",
      }}
    >
      <div className="skeleton-shimmer"></div>
      <div className="skeleton-footer">
        <div style={{ flexGrow: 1 }}>
          <div className="skeleton-text-1"></div>
          <div className="skeleton-text-2"></div>
        </div>
        <div className="skeleton-btn"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
