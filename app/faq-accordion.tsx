"use client";

import { useState } from "react";

type Faq = {
  question: string;
  answer: string;
};

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-8">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={faq.question}
            className="animate-on-scroll"
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 border-b border-[rgba(0,0,0,0.08)] py-[18px] text-left"
              aria-expanded={isOpen}
            >
              <span className="text-base font-medium text-[#1a1a2e]">
                {faq.question}
              </span>
              <span
                className={`text-xl font-light leading-none text-[#042C53] transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                isOpen ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <p className="pb-4 text-sm leading-[1.7] text-[#5F5E5A]">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
