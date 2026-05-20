"use client";

import { useEffect, useMemo, useState } from "react";

type Review = {
  quote: string;
  name: string;
  location: string;
};

export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const [activePage, setActivePage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  useEffect(() => {
    function syncCardsPerPage() {
      setCardsPerPage(window.innerWidth < 768 ? 1 : 3);
    }

    syncCardsPerPage();
    window.addEventListener("resize", syncCardsPerPage);

    return () => window.removeEventListener("resize", syncCardsPerPage);
  }, []);

  const pages = useMemo(() => {
    const chunks: Review[][] = [];

    for (let index = 0; index < reviews.length; index += cardsPerPage) {
      chunks.push(reviews.slice(index, index + cardsPerPage));
    }

    return chunks;
  }, [cardsPerPage, reviews]);

  const safeActivePage = pages.length ? activePage % pages.length : 0;

  useEffect(() => {
    if (isPaused || pages.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActivePage((current) => (current + 1) % pages.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [isPaused, pages.length]);

  function goToPrevious() {
    setActivePage((current) => (current - 1 + pages.length) % pages.length);
  }

  function goToNext() {
    setActivePage((current) => (current + 1) % pages.length);
  }

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${safeActivePage * 100}%)` }}
        >
          {pages.map((page, pageIndex) => (
            <div
              key={page.map((review) => review.name).join("-")}
              aria-hidden={pageIndex !== safeActivePage}
              className="grid min-w-full gap-4 md:grid-cols-3"
            >
              {page.map((review) => (
                <TestimonialCard
                  key={`${review.name}-${review.location}`}
                  quote={review.quote}
                  name={review.name}
                  location={review.location}
                />
              ))}
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

      <div className="mt-6 flex justify-center gap-1.5">
        {pages.map((page, index) => (
          <button
            key={page.map((review) => review.name).join("-")}
            type="button"
            aria-label={`Show review set ${index + 1}`}
            onClick={() => setActivePage(index)}
            className={`h-2 w-2 rounded-full ${
              index === safeActivePage ? "bg-[#042C53]" : "bg-[#D3D1C7]"
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
}: {
  quote: string;
  name: string;
  location: string;
}) {
  return (
    <div className="h-full rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-5">
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
