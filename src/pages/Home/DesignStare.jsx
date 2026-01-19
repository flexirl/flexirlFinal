import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * 3D Rotating Image Carousel
 * Inspired by lightswind.com 3D carousel component
 *
 * Features:
 * - Full 3D perspective rotation
 * - Auto-rotate with pause on hover
 * - Drag to rotate
 * - Keyboard navigation
 * - Smooth transitions
 */

const Carousel3D = ({
  images: customImages,
  autoPlayInterval = 3000,
  width = 800,
  height = 500,
}) => {
  // Default placeholder images
  const defaultImages = [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80",
  ];

  const images = customImages || defaultImages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [rotation, setRotation] = useState(0);
  const carouselRef = useRef(null);

  const cellsAmount = images.length;
  const anglePerCell = 360 / cellsAmount;
  const theta = (2 * Math.PI) / cellsAmount;
  const radius = Math.round(width / 2 / Math.tan(theta / 2));

  // Auto-rotate
  useEffect(() => {
    if (!isHovered && !isDragging) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % cellsAmount);
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [isHovered, isDragging, cellsAmount, autoPlayInterval]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cellsAmount) % cellsAmount);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cellsAmount);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const rotationDelta = deltaX * 0.5;
    setRotation(rotationDelta);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      const steps = Math.round(rotation / anglePerCell);
      setCurrentIndex(
        (prev) => (prev - steps + cellsAmount * 10) % cellsAmount,
      );
      setRotation(0);
    }
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    const rotationDelta = deltaX * 0.5;
    setRotation(rotationDelta);
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      const steps = Math.round(rotation / anglePerCell);
      setCurrentIndex(
        (prev) => (prev - steps + cellsAmount * 10) % cellsAmount,
      );
      setRotation(0);
    }
    setIsDragging(false);
  };

  const targetRotation = currentIndex * -anglePerCell + rotation;

  return (
    <div className="w-full py-16">
      {/* Header */}
      {/* <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
        <p className="text-sm uppercase tracking-widest text-neutral-500 mb-2">
          3D Gallery
        </p>
        <h2 className="text-4xl md:text-5xl font-light tracking-wider text-neutral-800 mb-4">
          Interactive Showcase
        </h2>
        <p className="text-neutral-600">
          Drag to rotate • Use arrow keys • Click to navigate
        </p>
      </div> */}

      {/* 3D Carousel Container */}
      <div className="flex justify-center items-center">
        <div
          className="relative select-none"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            perspective: "1000px",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={carouselRef}
        >
          {/* Scene */}
          <div
            className="w-full h-full relative"
            style={{
              transformStyle: "preserve-3d",
              transform: `translateZ(${-radius}px) rotateY(${targetRotation}deg)`,
              transition: isDragging
                ? "none"
                : "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* Cells */}
            {images.map((image, index) => {
              const angle = anglePerCell * index;
              const isCurrent = index === currentIndex;

              return (
                <div
                  key={index}
                  className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-xl shadow-2xl cursor-grab active:cursor-grabbing"
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                    backfaceVisibility: "hidden",
                    opacity: isCurrent ? 1 : 0.7,
                    transition: isDragging ? "none" : "opacity 0.6s",
                  }}
                >
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                  />
                  {isCurrent && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                      <p className="text-white text-xl font-light">
                        Image {index + 1}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 hover:bg-white shadow-xl text-neutral-800 flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 hover:bg-white shadow-xl text-neutral-800 flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-2 mt-12">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-neutral-800"
                : "w-2 bg-neutral-300 hover:bg-neutral-400"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Instructions */}
      {/* <div className="max-w-2xl mx-auto mt-12 px-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-neutral-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                />
              </svg>
            </div>
            <p className="text-sm text-neutral-600">Drag to Spin</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-neutral-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
            </div>
            <p className="text-sm text-neutral-600">Click Arrows</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-neutral-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <p className="text-sm text-neutral-600">Arrow Keys</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Carousel3D;
