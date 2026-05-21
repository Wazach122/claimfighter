"use client";

import { useEffect, useMemo, useState } from "react";

type Review = {
  quote: string;
  name: string;
  location: string;
};

export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    function syncVisibleCount() {
      setVisibleCount(window.innerWidth < 768 ? 1 : 3);
      setActiveIndex(0);
    }

    syncVisibleCount();
    window.addEventListener("resize", syncVisibleCount);

    return () => window.removeEventListener("resize", syncVisibleCount);
  }, []);

  const pageCount = useMemo(
    () => Math.ceil(reviews.length / visibleCount),
    [reviews.length, visibleCount],
  );
  const maxStartIndex = Math.max(reviews.length - visibleCount, 0);
  const safeActiveIndex =
    activeIndex > maxStartIndex ? 0 : Math.max(activeIndex, 0);
  const activePage = Math.floor(safeActiveIndex / visibleCount);
  const slideStep =
    visibleCount === 1
      ? "calc(100% + 16px)"
      : "calc(((100% - 32px) / 3) + 16px)";

  useEffect(() => {
    if (isPaused || reviews.length <= visibleCount) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        const nextIndex = current + visibleCount;

        return nextIndex > maxStartIndex ? 0 : nextIndex;
      });
    }, 4000);

    return () => window.clearInterval(timer);
  }, [isPaused, maxStartIndex, reviews.length, visibleCount]);

  function goToPrevious() {
    setActiveIndex((current) => {
      const previousIndex = current - visibleCount;

      return previousIndex < 0 ? maxStartIndex : previousIndex;
    });
  }

  function goToNext() {
    setActiveIndex((current) => {
      const nextIndex = current + visibleCount;

      return nextIndex > maxStartIndex ? 0 : nextIndex;
    });
  }

  return (
    <div
      className="relative min-h-[280px] w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="min-h-[240px]">
        <div
          className="flex items-stretch gap-4 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(calc(-${safeActiveIndex} * ${slideStep}))`,
          }}
        >
          {reviews.map((review, reviewIndex) => (
            <div
              key={`${review.name}-${review.location}`}
              className="box-border flex min-h-[200px] w-full min-w-full shrink-0 px-4 md:min-w-[calc(33.333%-11px)] md:px-0"
            >
              <TestimonialCard
                quote={review.quote}
                name={review.name}
                location={review.location}
                animationDelay={`${Math.min(reviewIndex, 2) * 0.1}s`}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous reviews"
        onClick={goToPrevious}
        className="absolute -left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#D3D1C7] bg-white text-lg leading-none text-[#5F5E5A] shadow-sm md:-left-5"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next reviews"
        onClick={goToNext}
        className="absolute -right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#D3D1C7] bg-white text-lg leading-none text-[#5F5E5A] shadow-sm md:-right-5"
      >
        ›
      </button>

      <div className="mt-6 hidden justify-center gap-1.5 md:flex">
        {Array.from({ length: pageCount }).map((_, index) => (
          <button
            key={`review-dot-${index}`}
            type="button"
            aria-label={`Show review set ${index + 1}`}
            onClick={() => setActiveIndex(index * visibleCount)}
            className={`h-2 w-2 rounded-full ${
              index === activePage ? "bg-[#042C53]" : "bg-[#D3D1C7]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  location,
  animationDelay,
}: {
  quote: string;
  name: string;
  location: string;
  animationDelay: string;
}) {
  return (
    <div
      className="animate-on-scroll visible box-border flex h-auto min-h-[180px] w-full flex-col rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-5 opacity-100"
      style={{ transitionDelay: animationDelay }}
    >
      <p className="mb-2 text-sm leading-5 text-[#EF9F27]">★★★★★</p>
      <p className="text-sm italic leading-[1.7] text-[#5F5E5A]">
        &quot;{quote}&quot;
      </p>
      <p className="mt-3 text-[13px] font-medium leading-5 text-[#2C2C2A]">
        {name}
      </p>
      <p className="text-xs leading-5 text-[#888780]">{location}</p>
    </div>
  );
}
