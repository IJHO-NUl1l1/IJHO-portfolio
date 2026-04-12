"use client";

import { useState } from "react";
import ProjectMedia from "@/components/ui/ProjectMedia";
import type { OtherProject } from "@/lib/data";

export default function ProjectCard({ proj }: { proj: OtherProject }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: "var(--surface)",
        border: `1px solid ${isOpen ? "rgba(99,102,241,0.3)" : "var(--border-subtle)"}`,
      }}
    >
      <button
        className="w-full text-left p-6 flex items-start justify-between gap-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "var(--indigo-dim)",
                color: "var(--indigo-light)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              {proj.type}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {proj.period}
            </span>
          </div>
          <h3
            className="text-xl font-semibold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {proj.title}
          </h3>
          <p className="text-sm" style={{ color: "var(--indigo-light)" }}>
            {proj.subtitle}
          </p>
        </div>

        <span
          className="text-lg transition-transform duration-300 shrink-0 mt-1"
          style={{
            color: "var(--text-muted)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ↓
        </span>
      </button>

      {isOpen && (
        <div
          className="px-6 pb-6"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          {proj.media && proj.media.length > 0 && (
            <ProjectMedia media={proj.media} />
          )}

          <p
            className="text-sm leading-relaxed mt-5 mb-5"
            style={{ color: "var(--text-secondary)" }}
          >
            {proj.description}
          </p>

          <div className="mb-5">
            <p
              className="text-xs font-medium mb-2"
              style={{ color: "var(--indigo-light)" }}
            >
              My Role
            </p>
            <div className="flex flex-wrap gap-2">
              {proj.myRole.map((item, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background: "var(--indigo-dim)",
                    color: "var(--indigo-light)",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-5">
            {proj.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2">
                <span
                  className="w-1 h-1 rounded-full mt-2 shrink-0"
                  style={{ background: "var(--indigo)" }}
                />
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {h}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {proj.stack.map((s) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background: "var(--surface-2)",
                    color: "var(--text-muted)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            {(proj.links?.web || (proj.links?.githubs && proj.links.githubs.length > 0)) && (
              <div className="flex gap-2 flex-wrap">
                {proj.links?.web && (
                  <a
                    href={proj.links.web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-[1.02]"
                    style={{ background: "var(--indigo)", color: "#fff" }}
                  >
                    ↗ Live
                  </a>
                )}
                {proj.links?.githubs?.map((g) => (
                  <a
                    key={g.label}
                    href={g.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-[1.02]"
                    style={{
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                      background: "var(--surface-2)",
                    }}
                  >
                    GitHub — {g.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
