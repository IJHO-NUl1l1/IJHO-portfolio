"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/data";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10,10,15,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
      }}
    >
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <a
          href="#"
          className="text-sm font-bold tracking-tight gradient-text"
        >
          JIHO
        </a>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm transition-colors hover:text-white"
              style={{ color: "var(--text-muted)" }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="mailto:x8608666@gmail.com"
            className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-[1.03]"
            style={{
              border: "1px solid rgba(99,102,241,0.4)",
              color: "var(--indigo-light)",
            }}
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
