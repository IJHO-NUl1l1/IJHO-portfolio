"use client";

import { useState } from "react";
import { SKILLS } from "@/lib/data";

export default function AboutContact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("x8608666@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <section id="about" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-8 h-px" style={{ background: "var(--indigo)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--indigo-light)" }}>
              About
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2
                className="text-3xl font-bold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                복잡한 시스템을 직관적인 인터페이스로 만듭니다.
              </h2>
              <div className="flex flex-col gap-4">
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  실시간 데이터 흐름과 상태 변화를 기반으로, 성능과 구조를 고려한 사용자 경험을 설계합니다.
                  데이터를 단순히 표시하는 것을 넘어, 사용자가 복잡한 정보 구조를 별도의 학습 없이 이해할 수 있도록
                  흐름과 맥락을 설계하는 것을 중요하게 생각합니다.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  기능 구현에 그치지 않고 설치부터 실제 사용까지 이어지는 전체 사용자 흐름을 설계하며,
                  다수의 Web3 해커톤 참여 경험을 바탕으로 새로운 기술을 빠르게 학습해 실제 동작하는
                  제품으로 구현하는 데 강점이 있습니다.
                </p>
              </div>

              <div
                className="flex flex-col gap-2 mt-8 p-4 rounded-lg"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-muted)" }}>학교</span>
                  <span style={{ color: "var(--text-secondary)" }}>인하대학교 컴퓨터공학과</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--text-muted)" }}>학회</span>
                  <span style={{ color: "var(--text-secondary)" }}>BlueNode (블록체인)</span>
                </div>

              </div>
            </div>

            <div>
              <h3
                className="text-base font-semibold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                주요 기술
              </h3>
              <div className="flex flex-col gap-6">
                {Object.entries(SKILLS).map(([category, items]) => (
                  <div key={category}>
                    <p
                      className="text-xs font-medium mb-3"
                      style={{ color: "var(--indigo-light)" }}
                    >
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <span
                          key={skill}
                          className="text-sm px-3 py-1.5 rounded-lg"
                          style={{
                            background: "var(--surface)",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <p
                  className="text-xs font-medium mb-3"
                  style={{ color: "var(--indigo-light)" }}
                >
                  Prize
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { emoji: "🥇", title: "PYUSD — Build On Hackathon 2024", desc: "DataDiscovery" },
                    { emoji: "🥈", title: "Agoric Orchestration 2nd — Chain Abstraction 2024", desc: "Xchain Shop" },
                    { emoji: "🛒", title: "Honorable Mention SEDA — Chain Abstraction 2024", desc: "Xchain Shop" },
                  ].map((prize) => (
                    <div
                      key={prize.title}
                      className="flex items-center gap-3 p-3 rounded-lg"
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <span className="text-lg">{prize.emoji}</span>
                      <div>
                        <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                          {prize.title}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {prize.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-px" style={{ background: "var(--indigo)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--indigo-light)" }}>
              Contact
            </span>
          </div>

          <button
            onClick={copyEmail}
            className="group inline-flex items-center gap-3 transition-opacity hover:opacity-60"
          >
            <span className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              x8608666@gmail.com
            </span>
            <span className="text-sm" style={{ color: "var(--indigo)" }}>
              {copied ? "copied ✓" : "copy"}
            </span>
          </button>

          <div className="mt-6 flex items-center gap-4">
            <a
              href="https://github.com/IJHO-NUl1l1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-opacity hover:opacity-60"
              style={{ color: "var(--text-muted)" }}
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
