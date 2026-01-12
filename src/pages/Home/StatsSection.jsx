import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import a from "/images/a.jpg";
import d from "/images/abc.png";
import e from "/images/abcd.png";
import f from "/images/abcdef.png";
import g from "/images/pro1.jpg";
import h from "/images/proj2.jpg";
import b from "/images/proj3.jpg";


import Dazzling from "../../../src/assets/projectStare/Dazzling.png";
import makeup from "../../../src/assets/projectStare/makeup.png";
import mma from "../../../src/assets/projectStare/mma.png";
import mainak from "../../../src/assets/projectStare/mainak.png";
import flexirl from "../../../src/assets/projectStare/flexirl.png";

const StatsSection = () => {
  const sectionRef = useRef(null);
  const startedRef = useRef(false);
  const rafIdsRef = useRef([]);

  const [clientsCount, setClientsCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [ratingValue, setRatingValue] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const projectImages = useMemo(() => [Dazzling, makeup, mma, mainak, flexirl,], []);

  // Project links mapping - Update these URLs with actual project website links
  const projectLinks = useMemo(
    () => [
      "https://dazzlingworldacademy.com/",
      "https://makeupbyanchala.in/",
      "https://www.mmatrust.com/home",
      "https://www.flexirl.com/",
    ],
    []
  );

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? projectImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === projectImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleMacClick = () => {
    const link = projectLinks[currentIndex];
    if (link) {
      window.open(link, "_blank");
    }
  };

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === projectImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [projectImages.length]);

  // Counter animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const animateValue = (setter, from, to, duration, formatFn) => {
      const start = performance.now();
      const localIds = [];
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = from + (to - from) * progress;
        setter(formatFn ? formatFn(value) : Math.floor(value));
        if (progress < 1) {
          const id = requestAnimationFrame(step);
          localIds.push(id);
          rafIdsRef.current.push(id);
        } else {
          setter(formatFn ? formatFn(to) : to);
        }
      };
      const id = requestAnimationFrame(step);
      localIds.push(id);
      rafIdsRef.current.push(id);
      return () => {
        localIds.forEach((i) => cancelAnimationFrame(i));
      };
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startedRef.current = true;

            rafIdsRef.current.forEach((i) => cancelAnimationFrame(i));
            rafIdsRef.current = [];

            setClientsCount(0);
            setReviewsCount(0);
            setRatingValue(0);
            setUsersCount(0);

            animateValue(setClientsCount, 0, 60, 1200, (v) => Math.floor(v));
            animateValue(setReviewsCount, 0, 450, 1400, (v) => Math.floor(v));
            animateValue(setRatingValue, 0, 9.8, 1200, (v) =>
              Number(v.toFixed(1))
            );
            animateValue(setUsersCount, 0, 500, 1600, (v) => Math.floor(v));
          } else {
            startedRef.current = false;
            rafIdsRef.current.forEach((i) => cancelAnimationFrame(i));
            rafIdsRef.current = [];
            setClientsCount(0);
            setReviewsCount(0);
            setRatingValue(0);
            setUsersCount(0);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      rafIdsRef.current.forEach((i) => cancelAnimationFrame(i));
      rafIdsRef.current = [];
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-[#183942] py-12 lg:py-20">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="h-px w-24 bg-[#ffffff7c] mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight">
            Projects To Impact
          </h2>
          <p className="mt-6 text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">
            We design websites that are not just visuals—they're experiences.,
            <br />
            Every detail is crafted to inspire, engage, and make your brand
            unforgettable.
          </p>
        </div>

        {/* Mac Display with Navigation */}
        <div className="mb-16 w-full">
          <div className="flex items-center justify-center gap-4 lg:gap-8 px-4">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              className="flex-shrink-0 p-2 lg:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 flex items-center justify-center"
              aria-label="Previous project"
            >
              <FaChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>

            {/* Mac Display */}
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-lg">
                <div
                  className="relative py-4 md:py-8 cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95 group"
                  onClick={handleMacClick}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === "Enter" && handleMacClick()}
                  aria-label={`Click to visit project ${currentIndex + 1}`}
                >
                  {/* iMac Frame */}
                  <div className="relative bg-[#2a2a2a] rounded-t-2xl md:rounded-t-3xl border-[6px] md:border-[10px] border-[#2a2a2a] shadow-[0_10px_40px_rgba(0,0,0,0.3)] md:shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_50px_rgba(100,200,255,0.2)] active:shadow-[0_5px_30px_rgba(100,200,255,0.3)] transition-shadow duration-300">
                    <div className="absolute top-0.5 md:top-1 left-1/4 right-1/4 h-[1px] md:h-[2px] bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-full blur-sm" />

                    {/* macOS Traffic Lights */}
                    <div className="absolute top-2 md:top-3 left-3 md:left-4 flex gap-1.5 md:gap-2 z-10">
                      <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#ff5f56] shadow-sm" />
                      <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#ffbd2e] shadow-sm" />
                      <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#27c93f] shadow-sm" />
                    </div>

                    {/* Screen content */}
                    <div className="relative aspect-[16/10] bg-white overflow-hidden rounded-t-lg md:rounded-t-xl flex items-center justify-center">
                      <img
                        src={projectImages[currentIndex]}
                        alt={`Project preview ${currentIndex + 1}`}
                        className="w-full h-full object-contain transition-all duration-300"
                      />
                      {/* Click/Tap indicator overlay */}
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/5 active:bg-black/10 transition-colors duration-200 flex flex-col items-center justify-center opacity-0 hover:opacity-100 active:opacity-100 transition-opacity duration-200">
                        <div className="flex flex-col items-center gap-2">
                          <div className="hidden sm:block text-2xl">🔗</div>
                          <span className="text-xs sm:text-sm text-black/70 font-semibold whitespace-nowrap px-3 py-1.5 bg-white/80 rounded-full backdrop-blur-sm">
                            Tap to visit
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom chin */}
                  <div className="relative h-8 md:h-10 bg-gradient-to-b from-[#e5e5e5] via-[#d8d8d8] to-[#c5c5c5] rounded-b-xl md:rounded-b-2xl flex items-center justify-center shadow-md md:shadow-lg">
                    <div className="w-3 h-3 md:w-4 md:h-4 flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-black/30"
                      >
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                    </div>
                  </div>

                  {/* Stand */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className="w-10 h-8 md:w-14 md:h-12 bg-gradient-to-b from-[#d5d5d5] to-[#c0c0c0] shadow-md"
                      style={{
                        clipPath: "polygon(40% 0%, 60% 0%, 70% 100%, 30% 100%)",
                      }}
                    />
                    <div className="w-28 h-2 md:w-36 md:h-2.5 bg-gradient-to-b from-[#e8e8e8] to-[#d0d0d0] rounded-full shadow-md md:shadow-lg -mt-0.5" />
                    <div className="w-32 h-1 md:w-44 md:h-1.5 bg-black/8 blur-sm rounded-full mt-0.5" />
                  </div>
                </div>

                {/* Pagination indicator */}
                <div className="mt-6 flex justify-center items-center gap-2">
                  <span className="text-sm text-white/70">
                    {currentIndex + 1} / {projectImages.length}
                  </span>
                  <div className="flex gap-2">
                    {projectImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? "bg-white w-6"
                            : "bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Go to project ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Mobile-friendly interaction hint */}
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleMacClick}
                    className="text-xs sm:text-sm text-white/80 hover:text-white/100 flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 active:scale-95"
                    aria-label="Visit project website"
                  >
                    <span>🌐</span>
                    <span className="font-medium">Visit Website</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="flex-shrink-0 p-2 lg:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 flex items-center justify-center"
              aria-label="Next project"
            >
              <FaChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>

        {/* Stats section */}
        <div className="bg-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-2 order-1 lg:order-1 text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight">
                <span className="font-medium">Our</span>
                <span className="font-semibold"> Impacts</span>
                <span className="text-[#ef4b6e]">.</span>
              </h3>
              <p className="mt-6 text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">
                We are a digital agency, crafting data-driven digital product
                design & technology that transforms business. Flexirl focuses on
                human-centered UI/UX, research, and end-to-end development that
                users love.
              </p>
            </div>

            <div className="lg:col-span-3 order-2 lg:order-2 mt-8 lg:mt-0">
              <div className="grid grid-cols-2 gap-8 lg:gap-12">
                <div className="flex flex-col items-start text-left">
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#b1eeff] leading-none">
                    {clientsCount}
                    <span className="text-2xl sm:text-3xl md:text-4xl">+</span>
                  </div>
                  <div className="mt-3 text-sm sm:text-base text-white/80 font-medium">
                    Clients
                  </div>
                </div>

                <div className="flex flex-col items-start text-left">
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#b1eeff] leading-none">
                    {reviewsCount}
                    <span className="text-2xl sm:text-3xl md:text-4xl">+</span>
                  </div>
                  <div className="mt-3 text-sm sm:text-base text-white/80 font-medium">
                    Positive Reviews
                  </div>
                </div>

                <div className="flex flex-col items-start text-left">
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#b1eeff] leading-none">
                    {ratingValue}
                    <span className="text-2xl sm:text-3xl md:text-4xl">+</span>
                  </div>
                  <div className="mt-3 text-sm sm:text-base text-white/80 font-medium">
                    Rating Out of 10
                  </div>
                </div>

                <div className="flex flex-col items-start text-left">
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#b1eeff] leading-none">
                    {usersCount}
                    <span className="text-2xl sm:text-3xl md:text-4xl">+</span>
                  </div>
                  <div className="mt-3 text-sm sm:text-base text-white/80 font-medium">
                    Users Satisfied
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
