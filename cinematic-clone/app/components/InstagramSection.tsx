"use client";

import { useEffect, useRef, useState } from "react";
import useScrollFadeIn from "../hooks/useScrollFadeIn";
import { useTranslation } from "../i18n/I18nContext";

export default function InstagramSection() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollX, setScrollX] = useState(0);
    const { t } = useTranslation();

    const labelFade = useScrollFadeIn({ delay: 0, translateY: 40 });
    const linkFade = useScrollFadeIn<HTMLAnchorElement>({ delay: 100, translateY: 40 });
    const taglineFade = useScrollFadeIn({ delay: 200, translateY: 40 });

    // Placeholder images - would be replaced with actual Instagram feed
    const images = [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",

    ];

    useEffect(() => {
        const handleScroll = () => {
            if (!wrapperRef.current || !containerRef.current) return;

            const wrapper = wrapperRef.current;
            const rect = wrapper.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate the scroll progress within the wrapper
            const scrollableDistance = wrapper.offsetHeight - windowHeight;

            // How far we've scrolled into the section
            const scrolledAmount = -rect.top;

            // Only animate when we're inside the wrapper section
            if (scrolledAmount >= 0 && scrolledAmount <= scrollableDistance) {
                // Calculate progress (0 to 1)
                const scrollProgress = scrolledAmount / scrollableDistance;

                // Calculate max horizontal scroll distance
                const containerWidth = containerRef.current.scrollWidth;
                const visibleWidth = window.innerWidth; // Use window width instead
                const maxScroll = Math.max(0, containerWidth - visibleWidth);

                // Apply scroll based on progress
                setScrollX(scrollProgress * maxScroll);
            } else if (scrolledAmount < 0) {
                setScrollX(0);
            } else if (scrolledAmount > scrollableDistance) {
                const containerWidth = containerRef.current.scrollWidth;
                const visibleWidth = window.innerWidth;
                setScrollX(Math.max(0, containerWidth - visibleWidth));
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        // Also listen for resize
        window.addEventListener("resize", handleScroll, { passive: true });
        handleScroll(); // Initial call

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    return (
        // Wrapper with extra height to create scroll distance for horizontal animation
        <div ref={wrapperRef} className="relative" style={{ height: '300vh' }}>
            {/* Sticky section that stays fixed while scrolling through wrapper */}
            <section
                ref={stickyRef}
                className="sticky top-0 h-screen bg-[#faf8f5] overflow-hidden flex flex-col justify-center"
            >
                {/* Header */}
                <div className="text-center mb-8 mt-10 px-6">
                    <p ref={labelFade.ref} style={labelFade.style} className="text-[#d4c4b0] uppercase tracking-[0.5em] text-sm mb-2">
                        {t("instagram.label")}

                    </p>
                    <a
                        ref={linkFade.ref}
                        style={linkFade.style}
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-[#8b7355] uppercase tracking-[0.2em] text-xl hover:text-[#6b5340] transition-colors"
                    >
                        @CASANGELINA
                    </a>
                    <p ref={taglineFade.ref} style={taglineFade.style} className="text-[#a89680] mt-3 italic text-lg">{t("instagram.tagline")}</p>
                </div>

                {/* Instagram Horizontal Scroll */}
                <div className="relative w-full flex-1 flex items-center">
                    <div
                        ref={containerRef}
                        className="flex gap-6 px-8 transition-transform duration-150 ease-out"
                        style={{
                            transform: `translateX(-${scrollX}px)`,
                        }}
                    >
                        {images.map((src, index) => (
                            <a
                                key={index}
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative flex-shrink-0 overflow-hidden group"
                                style={{
                                    width: 'calc(60vh * 16 / 9)',
                                    height: '60vh'
                                }}
                            >
                                <img
                                    src={src}
                                    alt={`Instagram post ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <svg
                                        className="w-12 h-12 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section >
        </div >
    );
}
