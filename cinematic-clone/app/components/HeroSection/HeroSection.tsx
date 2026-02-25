"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "../../i18n/I18nContext";

function useIsTouchDevice() {
    const [isTouch, setIsTouch] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(hover: none)");
        setIsTouch(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);
    return isTouch;
}

interface HeroSectionProps {
    scrollProgress: number;
    isMuted: boolean;
    onMuteToggle: () => void;
    videoRef: React.RefObject<HTMLVideoElement | null>;
}

export default function HeroSection({
    scrollProgress,
    isMuted,
    onMuteToggle,
    videoRef,
}: HeroSectionProps) {
    const { t } = useTranslation();
    const isTouch = useIsTouchDevice();
    const [isHovering, setIsHovering] = useState(true);
    const targetPos = useRef({ x: 0, y: 0 });
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorPosRef = useRef({ x: 0, y: 0 });

    const heroOpacity = Math.max(0, 1 - scrollProgress * 2);
    const heroElementsOpacity = Math.max(0, 1 - scrollProgress * 2);

    // Smooth cursor lerp animation
    useEffect(() => {
        let animationId: number;
        const lerp = (start: number, end: number, factor: number) =>
            start + (end - start) * factor;

        const animate = () => {
            cursorPosRef.current = {
                x: lerp(cursorPosRef.current.x, targetPos.current.x, 0.5),
                y: lerp(cursorPosRef.current.y, targetPos.current.y, 0.5),
            };
            if (cursorRef.current) {
                cursorRef.current.style.left = `${cursorPosRef.current.x}px`;
                cursorRef.current.style.top = `${cursorPosRef.current.y}px`;
            }
            animationId = requestAnimationFrame(animate);
        };

        if (isHovering && !isTouch) {
            animationId = requestAnimationFrame(animate);
        }

        return () => cancelAnimationFrame(animationId);
    }, [isHovering]);

    return (
        <section
            className={`relative h-screen w-full overflow-hidden z-20 ${!isTouch && isHovering && heroOpacity > 0.3 ? "cursor-none" : ""}`}
            onMouseMove={(e) => { if (!isTouch) targetPos.current = { x: e.clientX, y: e.clientY }; }}
            onMouseEnter={(e) => {
                targetPos.current = { x: e.clientX, y: e.clientY };
                cursorPosRef.current = { x: e.clientX, y: e.clientY };
                setIsHovering(true);
            }}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => {
                onMuteToggle();
                if (videoRef.current) {
                    videoRef.current.muted = !isMuted;
                }
            }}
        >
            {/* Hero Content */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center px-6 z-30"
                style={{
                    opacity: heroOpacity,
                    transform: `translateY(${scrollProgress * -50}px)`,
                }}
            >
                <div className="mb-4 md:mb-8 h-px w-12 md:w-16 bg-white/60" />
                <h1 className="mb-3 md:mb-4 text-white tracking-[0.2em] md:tracking-[0.4em] text-lg md:text-2xl lg:text-3xl uppercase">
                    {t("hero.title")}
                </h1>
                <div className="mb-4 md:mb-6 h-px w-16 md:w-24 bg-white/40" />
                <p className="text-white/80 uppercase tracking-[0.1em] md:tracking-[0.2em] text-xs md:text-sm">
                    {t("hero.subtitle")}
                </p>
            </div>

            {/* Scroll Down Indicator */}
            <div
                className="absolute bottom-4 md:bottom-8 left-1/2 z-40 -translate-x-1/2 flex flex-col items-center"
                style={{
                    opacity: heroElementsOpacity,
                    transition: "opacity 0.3s ease",
                }}
            >
                <span className="mb-2 text-xs font-light tracking-[0.2em] text-white/50 uppercase">
                    {t("hero.scrollDown")}
                </span>
                <span className="text-xs font-light tracking-[0.1em] text-white/30 uppercase">
                    {t("hero.scrollHint")}
                </span>
                <svg
                    className="mt-2 md:mt-4 h-8 md:h-10 w-3 md:w-4 text-white animate-bounce"
                    fill="currentColor"
                    viewBox="0 0 16.74 39.42"
                >
                    <path d="M7.99,39.42c0.24,0.1,0.52,0.1,0.77,0c0.12-0.05,0.23-0.12,0.32-0.22l7.37-7.37c0.39-0.39,0.39-1.02,0-1.41 s-1.02-0.39-1.41,0l-5.66,5.66L9.37,1c0-0.55-0.45-1-1-1C8.09,0,7.84,0.11,7.66,0.29C7.48,0.47,7.37,0.72,7.37,1l0,35.08l-5.66-5.66 c-0.39-0.39-1.02-0.39-1.41,0s-0.39,1.02,0,1.41l7.37,7.37C7.75,39.29,7.87,39.37,7.99,39.42z" />
                </svg>
            </div>

            {/* Custom Speaker Cursor */}
            {!isTouch && isHovering && heroOpacity > 0.3 && (
                <div
                    ref={cursorRef}
                    className="fixed z-50"
                    style={{
                        left: 0,
                        top: 0,
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <div className="w-12 h-12 rounded-full border border-white/60 bg-black/20 backdrop-blur-sm flex items-center cursor-pointer justify-center">
                        {isMuted ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                                />
                            </svg>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
