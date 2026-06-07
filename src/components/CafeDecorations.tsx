import React from "react";

export function FloatingBean({ className }: { className?: string }) {
  return (
    <svg
      className={`absolute opacity-20 dark:opacity-10 pointer-events-none select-none animate-float-slow ${className}`}
      width="44"
      height="32"
      viewBox="0 0 44 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Playful, hand-drawn coffee bean silhouette */}
      <path
        d="M2 16C2 7.16344 10.9543 0 22 0C33.0457 0 42 7.16344 42 16C42 24.8366 33.0457 32 22 32C10.9543 32 2 24.8366 2 16Z"
        fill="#78350F"
      />
      <path
        d="M2.5 16C8.5 20.5 14.5 11.5 22 16C29.5 20.5 35.5 11.5 41.5 16"
        stroke="#FAF8F5"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StampRing({ className }: { className?: string }) {
  return (
    <div
      className={`absolute pointer-events-none select-none opacity-[0.1] dark:opacity-[0.02] border-4 border-dashed border-amber-900 rounded-full flex items-center justify-center animate-float-reverse ${className}`}
      style={{ width: "160px", height: "160px" }}
    >
      <span className="text-xs font-black tracking-widest text-amber-950 uppercase select-none p-4 text-center transform -rotate-12">
        Regulars Club • Verified
      </span>
    </div>
  );
}

export function SteamWave({ className }: { className?: string }) {
  return (
    <svg
      className={`absolute opacity-30 text-amber-700/40 pointer-events-none animate-steam ${className}`}
      width="24"
      height="48"
      viewBox="0 0 24 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 48C12 48 20 36 12 24C4 12 12 0 12 0"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
