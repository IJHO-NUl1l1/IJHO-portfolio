"use client";

import React, { useState } from "react";
import { PROJECTS } from "@/lib/data";

const p = PROJECTS.featured;

function getNodeStyle(type: string) {
  switch (type) {
    case "trigger":
      return { bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.35)", color: "#fb923c" };
    case "cache":
      return { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)", color: "#fcd34d" };
    case "api":
      return { bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.35)", color: "#d8b4fe" };
    case "db":
      return { bg: "rgba(59,130,246,0.14)", border: "rgba(59,130,246,0.4)", color: "#60a5fa" };
    case "realtime":
      return { bg: "rgba(45,212,191,0.12)", border: "rgba(45,212,191,0.38)", color: "#2dd4bf" };
    case "extension":
      return { bg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.38)", color: "#22d3ee" };
    case "result":
      return { bg: "rgba(34,197,94,0.18)", border: "rgba(34,197,94,0.45)", color: "#4ade80" };
    default:
      return { bg: "var(--surface-2)", border: "var(--border)", color: "var(--text-primary)" };
  }
}

export default function FeaturedProject() {
  const [activeTab, setActiveTab] = useState<"role" | "design" | "arch">("role");

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-8 h-px" style={{ background: "var(--indigo)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--indigo-light)" }}>
            Featured Project
          </span>
        </div>

        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background: "var(--indigo-dim)",
                color: "var(--indigo-light)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              {p.type}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {p.period}
            </span>
          </div>

          <h2
            className="text-4xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            {p.title}
          </h2>
          <p className="text-base mb-2" style={{ color: "var(--indigo-light)" }}>
            {p.subtitle}
          </p>
          <p
            className="text-base leading-relaxed max-w-2xl"
            style={{ color: "var(--text-secondary)" }}
          >
            {p.description}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <a
              href={p.links.web}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]"
              style={{ background: "var(--indigo)", color: "#fff" }}
            >
              <span>↗</span> 온보딩 웹
            </a>
            {[
              { label: "Extension", href: p.links.github },
              { label: "Server", href: p.links.server },
              { label: "Web", href: p.links.webRepo },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all hover:scale-[1.02]"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  background: "var(--surface)",
                }}
              >
                GitHub — {l.label}
              </a>
            ))}
          </div>
        </div>

        <div
          className="flex gap-1 p-1 rounded-lg w-fit mb-8"
          style={{ background: "var(--surface)" }}
        >
          {(
            [
              { key: "role", label: "Key Features" },
              { key: "design", label: "설계 과정" },
              { key: "arch", label: "아키텍처" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2 rounded-md text-sm font-medium transition-all"
              style={
                activeTab === tab.key
                  ? {
                      background: "var(--indigo)",
                      color: "#fff",
                    }
                  : { color: "var(--text-muted)" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "design" && (
          <div className="flex flex-col gap-4">
            {p.design.map((step, i) => (
              <div
                key={step.step}
                className="relative flex gap-5"
              >
                {i < p.design.length - 1 && (
                  <div
                    className="absolute left-[19px] top-10 bottom-0 w-px"
                    style={{ background: "var(--border)" }}
                  />
                )}

                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10"
                  style={
                    i === p.design.length - 1
                      ? { background: "var(--indigo)", color: "#fff" }
                      : { background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--indigo-light)" }
                  }
                >
                  {step.step}
                </div>

                <div
                  className="flex-1 p-5 rounded-xl mb-4"
                  style={{
                    background: i === p.design.length - 1 ? "rgba(99,102,241,0.06)" : "var(--surface)",
                    border: `1px solid ${i === p.design.length - 1 ? "rgba(99,102,241,0.25)" : "var(--border-subtle)"}`,
                  }}
                >
                  <p
                    className="text-sm font-semibold mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {step.label}
                  </p>

                  <p
                    className="text-sm leading-relaxed mb-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {step.situation}
                  </p>

                  <div
                    className="rounded-lg p-3 mb-3 font-mono text-xs leading-relaxed"
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      color: "var(--indigo-light)",
                    }}
                  >
                    {Array.isArray(step.numbers)
                      ? step.numbers.map((line, j) => <div key={j}>{line}</div>)
                      : step.numbers}
                  </div>

                  {step.problem && (
                    <div className="flex gap-2 items-start">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded shrink-0 font-mono"
                        style={{
                          background: "rgba(239,68,68,0.1)",
                          color: "rgb(252,165,165)",
                          border: "1px solid rgba(239,68,68,0.2)",
                        }}
                      >
                        문제
                      </span>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {step.problem}
                      </p>
                    </div>
                  )}
                  {step.result && (
                    <div className="flex gap-2 items-start">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded shrink-0 font-mono"
                        style={{
                          background: "rgba(34,197,94,0.1)",
                          color: "rgb(134,239,172)",
                          border: "1px solid rgba(34,197,94,0.2)",
                        }}
                      >
                        결과
                      </span>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {step.result}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "role" && (
          <div className="grid md:grid-cols-2 gap-4">
            {p.roles.map((role) => (
              <div
                key={role.title}
                className="p-5 rounded-xl"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {role.title}
                </h3>

                <ul className="flex flex-col gap-1.5 mb-4">
                  {role.desc.map((line, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span
                        className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                        style={{ background: "var(--indigo)" }}
                      />
                      <span
                        className="text-xs leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5">
                  {role.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: "var(--surface-2)",
                        color: "var(--text-muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "arch" && (
          <div className="flex flex-col gap-6">
            <div
              className="p-4 rounded-xl flex flex-wrap gap-x-3 gap-y-2 items-center"
              style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)" }}
            >
              <span className="text-xs mr-1" style={{ color: "var(--text-muted)" }}>System</span>
              {p.architecture.components.map((comp, i) => (
                <div key={comp.name} className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
                    style={{ background: `${comp.color}15`, border: `1px solid ${comp.color}30` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: comp.color }} />
                    <span className="text-xs font-medium" style={{ color: comp.color }}>
                      {comp.name}
                    </span>
                  </div>
                  {i < p.architecture.components.length - 1 && (
                    <span className="text-xs" style={{ color: "var(--border)" }}>—</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {p.architecture.flows.map((flow) => {
                type FlowNode = { text: string; type: string; cat?: string };
                type TypedFlow = typeof flow & { subtitle?: string; insight?: string; main?: boolean };
                const typedFlow = flow as TypedFlow;
                const isMain = !!typedFlow.main;

                return (
                  <div
                    key={flow.title}
                    className="rounded-xl overflow-hidden"
                    style={{
                      border: isMain
                        ? `1.5px solid ${flow.color}50`
                        : `1px solid ${flow.color}25`,
                    }}
                  >
                    <div
                      className="px-4 py-3"
                      style={{
                        background: isMain ? `${flow.color}14` : `${flow.color}08`,
                        borderBottom: `1px solid ${flow.color}20`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: flow.color }}
                        />
                        <span
                          style={{
                            color: flow.color,
                            fontSize: isMain ? "13px" : "12px",
                            fontWeight: isMain ? 700 : 600,
                          }}
                        >
                          {flow.title}
                        </span>
                        {isMain && (
                          <span
                            className="px-1.5 py-0.5 rounded text-xs font-medium"
                            style={{
                              background: `${flow.color}20`,
                              color: flow.color,
                              fontSize: "10px",
                            }}
                          >
                            핵심 플로우
                          </span>
                        )}
                      </div>
                      {typedFlow.subtitle && (
                        <p
                          className="pl-4 leading-relaxed"
                          style={{ color: "var(--text-muted)", fontSize: "11px" }}
                        >
                          {typedFlow.subtitle}
                        </p>
                      )}
                    </div>

                    {(() => {
                      const hasAnyLabel = flow.rows.some((r) => "label" in r && (r as { label?: string }).label);
                      const maxNodes = Math.max(...flow.rows.map((r) => r.nodes.length));
                      const nodeSegments = Array.from({ length: maxNodes }, (_, i) =>
                        i < maxNodes - 1 ? "auto auto" : "auto"
                      ).join(" ");
                      const colTemplate = hasAnyLabel ? `80px ${nodeSegments}` : nodeSegments;
                      const labelOffset = hasAnyLabel ? 1 : 0;

                      const cells = flow.rows.flatMap((row, ri) => {
                        const chipRow = ri * 2 + 1;
                        const boxRow  = ri * 2 + 2;
                        const label   = "label" in row ? (row as { label?: string }).label : undefined;
                        const items: React.ReactNode[] = [];

                        if (hasAnyLabel) {
                          items.push(
                            <div
                              key={`label-${ri}`}
                              style={{
                                gridColumn: 1,
                                gridRow: `${chipRow} / ${boxRow + 1}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                paddingRight: "8px",
                                paddingTop: ri > 0 ? "10px" : 0,
                              }}
                            >
                              {label && (
                                <span
                                  style={{
                                    background: `${flow.color}15`,
                                    color: flow.color,
                                    border: `1px solid ${flow.color}35`,
                                    borderRadius: "4px",
                                    padding: "2px 8px",
                                    fontSize: "10px",
                                    fontWeight: 600,
                                    letterSpacing: "0.03em",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {label}
                                </span>
                              )}
                            </div>
                          );
                        }

                        (row.nodes as FlowNode[]).forEach((n, ni) => {
                          const ns = getNodeStyle(n.type ?? "default");
                          const col = labelOffset + 1 + ni * 2;
                          const lines = n.text.split("\n");

                          items.push(
                            <div
                              key={`chip-${ri}-${ni}`}
                              style={{
                                gridColumn: col,
                                gridRow: chipRow,
                                display: "flex",
                                alignItems: "flex-end",
                                justifyContent: "center",
                                paddingBottom: "3px",
                                paddingTop: ri > 0 ? "10px" : 0,
                              }}
                            >
                              <span
                                style={{
                                  background: ns.border,
                                  color: ns.color,
                                  borderRadius: "3px",
                                  padding: "1px 6px",
                                  fontSize: "9px",
                                  fontWeight: 700,
                                  letterSpacing: "0.06em",
                                  opacity: 0.9,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {n.cat ?? n.type}
                              </span>
                            </div>
                          );

                          items.push(
                            <div
                              key={`box-${ri}-${ni}`}
                              style={{
                                gridColumn: col,
                                gridRow: boxRow,
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                style={{
                                  background: ns.bg,
                                  border: `1px solid ${ns.border}`,
                                  borderRadius: "8px",
                                  height: "48px",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "0 10px",
                                }}
                              >
                                {lines.map((line, li) => (
                                  <div
                                    key={li}
                                    style={{
                                      color: li === 0 ? ns.color : "var(--text-muted)",
                                      fontSize: li === 0 ? "11px" : "10px",
                                      fontWeight: li === 0 ? 600 : 400,
                                      lineHeight: 1.3,
                                      textAlign: "center",
                                    }}
                                  >
                                    {line}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );

                          if (ni < row.nodes.length - 1) {
                            items.push(
                              <div
                                key={`arrow-${ri}-${ni}`}
                                style={{
                                  gridColumn: col + 1,
                                  gridRow: boxRow,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <span style={{ color: flow.color, opacity: 0.5, fontSize: "13px" }}>→</span>
                              </div>
                            );
                          }
                        });

                        return items;
                      });

                      return (
                        <div
                          style={{
                            display: "inline-grid",
                            gridTemplateColumns: colTemplate,
                            columnGap: "8px",
                            padding: "12px 16px",
                          }}
                        >
                          {cells}
                        </div>
                      );
                    })()}

                    {typedFlow.insight && (
                      <div
                        className="px-4 py-3 flex items-start gap-2"
                        style={{
                          borderTop: `1px solid ${flow.color}40`,
                          background: `${flow.color}12`,
                        }}
                      >
                        <span className="shrink-0 mt-px font-bold" style={{ color: flow.color, fontSize: "11px" }}>
                          ✦
                        </span>
                        <p className="text-xs leading-relaxed font-medium" style={{ color: flow.color, opacity: 0.9 }}>
                          {typedFlow.insight}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              className="pt-4"
              style={{ borderTop: "1px solid var(--border-subtle)" }}
            >
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "var(--surface-2)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
