"use client";

import { type MutableRefObject } from "react";

interface VideoLayerProps {
    scrollProgress: number;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    directionRef: MutableRefObject<"down" | "up">;
}

export default function VideoLayer({ scrollProgress, videoRef, directionRef }: VideoLayerProps) {
    const ANCHOR_PROGRESS = 0.85;
    const p = Math.min(scrollProgress, ANCHOR_PROGRESS);
    const scrollT = p / ANCHOR_PROGRESS;

    const FINAL_X = 18;
    const FINAL_Y = 22;

    const x = scrollT * (directionRef.current === "down" ? FINAL_X : -FINAL_X);
    const y = scrollT * FINAL_Y;

    const heroOpacity = Math.max(0, 1 - scrollProgress * 2);

    return (
        <div
            className="fixed inset-0 z-10 pointer-events-none"
            style={{
                opacity: scrollProgress >= 1 ? 0 : 1,
                visibility: scrollProgress >= 1 ? "hidden" : "visible",
                transition: "opacity 0.5s ease, visibility 0.5s ease",
            }}
        >
            <div
                className="absolute inset-0 will-change-[clip-path,transform]"
                style={{
                    clipPath: `inset(
              ${p * 35}% 
              ${p * 2}% 
              ${p * 55}% 
              ${p * 2}%
            )`,
                    transform: `
              translate(${x}vw, ${y}vh)
              scale(${1 - p * 0.05})
            `,
                    transition: "transform 0.25s ease-out",
                }}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/video/home2025fhd.mp4" type="video/mp4" />
                </video>
            </div>

            <div
                className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50"
                style={{ opacity: heroOpacity }}
            />
        </div>
    );
}
