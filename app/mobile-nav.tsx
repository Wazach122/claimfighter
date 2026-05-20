"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#what-you-get", label: "What You Get" },
  { href: "#faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800"
      >
        <span className="flex flex-col gap-1.5" aria-hidden="true">
          <span className="h-0.5 w-5 rounded-full bg-current" />
          <span className="h-0.5 w-5 rounded-full bg-current" />
          <span className="h-0.5 w-5 rounded-full bg-current" />
        </span>
      </button>

      {isOpen ? (
        <nav className="absolute left-0 top-full w-full border-t border-[rgba(0,0,0,0.08)] bg-white shadow-lg">
          {navItems.map((item) =>
            item.href.startsWith("/") ? (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block border-b border-[rgba(0,0,0,0.08)] px-5 py-3 text-sm font-semibold text-slate-700"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block border-b border-[rgba(0,0,0,0.08)] px-5 py-3 text-sm font-semibold text-slate-700"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>
      ) : null}
    </div>
  );
}
