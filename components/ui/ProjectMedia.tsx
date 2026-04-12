"use client";

import { useState, useEffect } from "react";
import type { MediaItem } from "@/lib/data";

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useState<{ mx: number; my: number; px: number; py: number } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setScale((s) => Math.min(Math.max(s + delta, 0.5), 5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    setDragging(true);
    dragStart[1]({ mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !dragStart[0]) return;
    setPos({
      x: dragStart[0].px + (e.clientX - dragStart[0].mx),
      y: dragStart[0].py + (e.clientY - dragStart[0].my),
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
    dragStart[1](null);
  };

  const reset = () => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: "rgba(0,0,0,0.9)" }}
      onClick={onClose}
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* 닫기 */}
      <button
        className="absolute top-4 right-5 text-2xl transition-opacity hover:opacity-60"
        style={{ color: "#fff", zIndex: 10 }}
        onClick={onClose}
      >
        ✕
      </button>

      {/* 줌 컨트롤 */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{ background: "rgba(0,0,0,0.5)", zIndex: 10 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="text-white hover:opacity-60 transition-opacity text-lg w-6 text-center"
          onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))}
        >
          −
        </button>
        <span className="text-xs text-white/70 w-10 text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          className="text-white hover:opacity-60 transition-opacity text-lg w-6 text-center"
          onClick={() => setScale((s) => Math.min(s + 0.25, 5))}
        >
          +
        </button>
        <div className="w-px h-3 bg-white/20" />
        <button
          className="text-xs text-white/70 hover:opacity-60 transition-opacity"
          onClick={reset}
        >
          reset
        </button>
      </div>

      {/* 이미지 */}
      <img
        src={src}
        alt={alt}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg select-none"
        style={{
          transform: `scale(${scale}) translate(${pos.x / scale}px, ${pos.y / scale}px)`,
          cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in",
          transition: dragging ? "none" : "transform 0.1s ease",
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onDoubleClick={reset}
        draggable={false}
      />

      {scale > 1 && (
        <p
          className="absolute top-4 left-1/2 -translate-x-1/2 text-xs"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          드래그로 이동 · 더블클릭으로 초기화
        </p>
      )}
    </div>
  );
}

function MediaRenderer({
  item,
  onImageClick,
}: {
  item: MediaItem;
  onImageClick?: () => void;
}) {
  const isEmpty = !item.src;

  if (isEmpty) {
    return (
      <div
        className="w-full h-full flex items-center justify-center text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        {item.type === "video" ? "video 준비 중" : "image 준비 중"}
      </div>
    );
  }

  if (item.type === "video") {
    return (
      <video
        src={item.src}
        poster={item.poster}
        controls
        className="w-full h-full object-contain"
      />
    );
  }

  return (
    <img
      src={item.src}
      alt={item.alt ?? ""}
      className="w-full h-full object-contain cursor-zoom-in"
      onClick={onImageClick}
    />
  );
}

export default function ProjectMedia({ media }: { media: MediaItem[] }) {
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!media || media.length === 0) return null;

  const isCarousel = media.length > 1;
  const current = media[idx];

  return (
    <>
      {lightbox && current.type === "image" && current.src && (
        <ImageLightbox
          src={current.src}
          alt={current.alt ?? ""}
          onClose={() => setLightbox(false)}
        />
      )}

      <div
        className="rounded-lg overflow-hidden relative"
        style={{
          aspectRatio: "16 / 9",
          width: "70%",
          margin: "20px auto",
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
        }}
      >
        <MediaRenderer
          item={current}
          onImageClick={current.type === "image" && current.src ? () => setLightbox(true) : undefined}
        />

        {isCarousel && (
          <>
            <button
              onClick={() => setIdx((i) => (i - 1 + media.length) % media.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all hover:scale-110"
              style={{
                width: "28px",
                height: "28px",
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
                fontSize: "13px",
              }}
            >
              ←
            </button>
            <button
              onClick={() => setIdx((i) => (i + 1) % media.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all hover:scale-110"
              style={{
                width: "28px",
                height: "28px",
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
                fontSize: "13px",
              }}
            >
              →
            </button>

            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {media.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: i === idx ? "18px" : "6px",
                    height: "6px",
                    background: i === idx ? "var(--indigo)" : "rgba(255,255,255,0.35)",
                  }}
                />
              ))}
            </div>

            <div
              className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-xs"
              style={{
                background: "rgba(0,0,0,0.45)",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              {idx + 1} / {media.length}
            </div>
          </>
        )}
      </div>
    </>
  );
}
