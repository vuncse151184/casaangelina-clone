"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > window.innerHeight);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            style={{
                position: "fixed",
                bottom: "32px",
                right: "32px",
                zIndex: 90,
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "1px solid rgba(139, 115, 85, 0.3)",
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(8px)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? "auto" : "none",
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.4s ease, transform 0.4s ease, border-color 0.3s ease, background 0.3s ease",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(139, 115, 85, 0.6)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(139, 115, 85, 0.3)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.85)";
            }}
        >
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8b7355"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="18 15 12 9 6 15" />
            </svg>
        </button>
    );
}
