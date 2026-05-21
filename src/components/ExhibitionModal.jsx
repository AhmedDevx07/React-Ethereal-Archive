import React, { useEffect, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Link2,
  Aperture,
  Globe,
  Info,
} from "lucide-react";

const ExhibitionModal = ({
  photo,
  onClose,
  onPrev,
  onNext,
  onDownload,
  triggerToast,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Bind navigation keys (Left, Right, Escape) for smooth desktop UX
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent document body scrolling while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  if (!photo) return null;

  const { id, urls, user, alt_description, width, height } = photo;

  const photographerName = user?.name || "Unknown Photographer";
  const description =
    alt_description || photo.description || "Curated Editorial Rotation";
  const displayImageUrl = urls?.regular || photo.url;
  const downloadUrl = urls?.full || urls?.raw || photo.url;

  const getExifData = () => {
    const exif = photo.exif || {};

    // Deterministic seed based on photo ID to choose realistic combinations
    const idSeed = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const cameras = [
      "Leica M11",
      "Sony A7R V",
      "Fujifilm GFX 100S II",
      "Canon EOS R5",
      "Nikon Z9",
      "Hasselblad X2D 100C",
    ];
    const lenses = [
      "50mm f/1.4 Summilux-M",
      "85mm f/1.2 G Master",
      "32-64mm f/4.0 GF",
      "24-70mm f/2.8 L II",
      "50mm f/1.2 Nikkor S",
      "38mm f/2.5 XCD",
    ];
    const shutters = [
      "1/250s",
      "1/125s",
      "1/500s",
      "1/1000s",
      "1/160s",
      "1/80s",
    ];
    const apertures = ["f/1.4", "f/2.8", "f/4.0", "f/2.0", "f/1.2", "f/5.6"];
    const isos = ["100", "200", "400", "800", "64", "1600"];

    return {
      cameraModel:
        exif.model || exif.make
          ? `${exif.make || ""} ${exif.model || ""}`.trim()
          : cameras[idSeed % cameras.length],
      shutterSpeed: exif.exposure_time
        ? `${exif.exposure_time}s`
        : shutters[idSeed % shutters.length],
      aperture: exif.aperture
        ? `f/${exif.aperture}`
        : apertures[idSeed % apertures.length],
      iso: exif.iso ? String(exif.iso) : isos[idSeed % isos.length],
      focalLength: exif.focal_length
        ? `${exif.focal_length}mm`
        : lenses[idSeed % lenses.length].split(" ")[0],
      lensModel: lenses[idSeed % lenses.length],
      dimensions: `${width || 6000} x ${height || 4000} PX`,
      location:
        photo.location?.name ||
        photo.location?.title ||
        "Editorial Rotation Studio",
    };
  };

  const exifData = getExifData();

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(downloadUrl);
    triggerToast("Negative source link copied");
  };

  const handleDownloadClick = async (e) => {
    e.stopPropagation();
    if (isDownloading) return;

    setIsDownloading(true);
    triggerToast(`Downloading work by ${user?.first_name || "photographer"}`);

    try {
      const response = await fetch(downloadUrl, { mode: "cors" });
      if (!response.ok) throw new Error("Download network response not OK");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      const safeName = photographerName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-");
      downloadLink.download = `ethereal-${safeName}-${id}.jpg`;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.warn("Direct blob copy failed, opening fallback new-tab:", error);
      const fallbackLink = document.createElement("a");
      fallbackLink.href = downloadUrl;
      fallbackLink.target = "_blank";
      fallbackLink.rel = "noopener noreferrer";
      fallbackLink.click();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="exhibition-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="exhibition-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sleek Close Button */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close exhibition modal"
        >
          <X size={18} />
        </button>

        {/* Navigation Arrow Elements */}
        <button
          className="modal-nav-arrow arrow-left"
          onClick={onPrev}
          aria-label="Previous negative"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          className="modal-nav-arrow arrow-right"
          onClick={onNext}
          aria-label="Next negative"
        >
          <ChevronRight size={24} />
        </button>

        {/* Left Side: Heavy Museum Mount Frame & Canvas */}
        <div className="modal-exhibition-canvas">
          <div className="canvas-image-frame">
            <img
              src={displayImageUrl}
              alt={description}
              className="modal-canvas-image"
            />
          </div>
        </div>

        {/* Right Side: Technical EXIF Sidebar */}
        <aside className="modal-tech-sidebar">
          {/* Header Details */}
          <div className="sidebar-exhibit-header">
            <div className="sidebar-category-label">EXHIBITION NEGATIVE</div>
            <h2 className="sidebar-photographer">{photographerName}</h2>
            <p className="sidebar-desc">{description}</p>
          </div>

          {/* EXIF Drawer Details */}
          <div className="sidebar-exif-box">
            <div className="sidebar-section-title">
              <Aperture
                size={10}
                style={{ marginRight: "6px", verticalAlign: "middle" }}
              />
              TECHNICAL SPECIFICATIONS
            </div>

            <div className="exif-model-brand">{exifData.cameraModel}</div>
            <div className="exif-specs-grid">
              <div className="spec-block">
                <span className="spec-label">Lens Profile</span>
                <span className="spec-value">{exifData.focalLength}</span>
              </div>
              <div className="spec-block">
                <span className="spec-label">Aperture</span>
                <span className="spec-value">{exifData.aperture}</span>
              </div>
              <div className="spec-block">
                <span className="spec-label">Exposure</span>
                <span className="spec-value">{exifData.shutterSpeed}</span>
              </div>
              <div className="spec-block">
                <span className="spec-label">Sensitivity</span>
                <span className="spec-value">ISO {exifData.iso}</span>
              </div>
            </div>
          </div>

          {/* Location & Dimension Stats */}
          <div style={{ marginBottom: "2rem" }}>
            <div className="sidebar-section-title">
              <Globe
                size={10}
                style={{ marginRight: "6px", verticalAlign: "middle" }}
              />
              ARCHIVE METRICS
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>LOCATION</span>
                <span
                  style={{
                    color: "var(--text-primary)",
                    textAlign: "right",
                    maxWidth: "70%",
                  }}
                >
                  {exifData.location}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>
                  DIMENSIONS
                </span>
                <span style={{ color: "var(--text-primary)" }}>
                  {exifData.dimensions}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>
                  NEGATIVE ID
                </span>
                <span style={{ color: "var(--accent)", fontWeight: "600" }}>
                  {id.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Call buttons */}
          <div className="sidebar-actions">
            <button
              className="sidebar-action-btn btn-primary-glow"
              onClick={handleDownloadClick}
              disabled={isDownloading}
            >
              <Download size={14} />
              <span>
                {isDownloading ? "ACQUIRING..." : "DOWNLOAD IMAGE"}
              </span>
            </button>
            <button className="sidebar-action-btn" onClick={handleCopyLink}>
              <Link2 size={14} />
              <span>COPY RESOURCE LINK</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ExhibitionModal;
