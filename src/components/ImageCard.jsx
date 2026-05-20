import React, { useState } from "react";
import { Eye } from "lucide-react";

const ImageCard = ({ photo, index, onSelect }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  const { id, urls, user, alt_description, width, height } = photo;

  // Optimized height calculations for compact laptop screens
  const aspectRatio = height / width;
  const cappedAspectRatio = Math.max(0.6, Math.min(1.2, aspectRatio));
  const gridSpan = Math.ceil(cappedAspectRatio * 12) + 12;

  const photographerName = user?.name || "Unknown Photographer";
  const description = alt_description || photo.description || "Editorial Work";
  const displayImageUrl = urls?.regular || photo.url;

  // Deterministic camera EXIF stats summary for the card overlay
  const idSeed = id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const lenses = ["50mm", "85mm", "35mm", "24mm", "90mm", "135mm"];
  const apertures = ["f/1.4", "f/2.8", "f/1.8", "f/2.0", "f/4.0", "f/1.2"];
  const exifSummary =
    photo.exif?.focal_length && photo.exif?.aperture
      ? `${photo.exif.focal_length}mm • f/${photo.exif.aperture}`
      : `${lenses[idSeed % lenses.length]} • ${apertures[idSeed % apertures.length]}`;

  const filmFrameNumber = String(index + 1).padStart(3, "0");

  // Specific handler to open lightbox view safely without conflicts
  const handleViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents double event bubbling since parent article also has onSelect
    onSelect(photo, index);
  };

  return (
    <article
      className={`image-card ${imgLoaded ? "loaded" : ""}`}
      onClick={() => onSelect(photo, index)}
      style={{
        gridRowEnd: `span ${gridSpan}`,
        animationDelay: `${index * 80}ms`,
        animationName: "fadeIn",
        animationDuration: "0.8s",
        animationTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        animationFillMode: "both",
      }}
    >
      {/* Museum Physical Negative Framing Header */}
      <div className="card-film-header">
        <span className="film-number">FN-{filmFrameNumber}</span>
        <span className="film-crop-marks">✦ SAFETY FILM ✦</span>
      </div>

      <div className="image-wrapper">
        <img
          src={displayImageUrl}
          alt={description}
          className="card-image"
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />

        <div className="card-overlay">
          <div className="card-details">
            <div className="card-meta-text">
              <div className="image-exif-summary">{exifSummary}</div>
              <h2 className="photographer-name">{photographerName}</h2>
              <p className="image-desc">{description}</p>
            </div>

            <button
              onClick={handleViewClick}
              className="download-btn" // Keeping class same so existing styles don't break
              title="View Exhibition Blueprint"
              aria-label={`View image by ${photographerName}`}
            >
              <Eye size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ImageCard;
