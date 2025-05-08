import React from "react";

interface TrailerModalProps {
  trailerUrl: string;
  onClose: () => void;
}

export default function TrailerModal({ trailerUrl, onClose }: TrailerModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="relative w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden">
        <iframe
          src={trailerUrl.replace("watch?v=", "embed/")}
          className="w-full h-full"
          title="Movie Trailer"
          allowFullScreen
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white text-black rounded-full p-2"
        >
          ✖
        </button>
      </div>
    </div>
  );
}
