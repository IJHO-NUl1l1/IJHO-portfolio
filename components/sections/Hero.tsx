"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; alpha: number; size: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.1,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
          style={{
            background: "var(--indigo-dim)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "var(--indigo-light)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--indigo-light)" }}
          />
          Frontend Developer
        </div>

        <h1
          className="text-6xl font-bold tracking-tight mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          I&apos;m{" "}
          <span className="gradient-text">JIHO</span>
        </h1>

        <p
          className="text-xl leading-relaxed mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          복잡한 시스템을 직관적인 인터페이스로 만드는 프론트엔드 개발자
        </p>
        <p
          className="text-base leading-relaxed mb-12 max-w-xl mx-auto"
          style={{ color: "var(--text-muted)" }}
        >
          Web3와 실시간 웹을 넘나들며, 데이터 흐름과 사용자 경험을 함께 설계합니다.
        </p>

        <div className="flex items-center justify-center gap-4">
          <a
            href="#projects"
            className="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.03]"
            style={{
              background: "var(--indigo)",
              color: "#fff",
              boxShadow: "0 0 24px rgba(99,102,241,0.3)",
            }}
          >
            프로젝트 보기
          </a>
          <a
            href="https://github.com/IJHO-NUl1l1"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.03]"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              background: "var(--surface)",
            }}
          >
            GitHub
          </a>
        </div>

      </div>
    </section>
  );
}
