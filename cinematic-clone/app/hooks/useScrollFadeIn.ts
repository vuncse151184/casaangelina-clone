"use client";

import { useEffect, useRef, useState, CSSProperties } from "react";

interface UseScrollFadeInOptions {
    /** How much of the element must be visible to trigger (0-1). Default: 0.15 */
    threshold?: number;
    /** Delay before animation starts (ms). Default: 0 */
    delay?: number;
    /** Distance to translate from (px). Default: 60 */
    translateY?: number;
    /** Animation duration (ms). Default: 800 */
    duration?: number;
}

export default function useScrollFadeIn<T extends HTMLElement = HTMLDivElement>(
    options: UseScrollFadeInOptions = {}
): { ref: React.RefObject<T | null>; style: CSSProperties } {
    const { threshold = 0.15, delay = 0, translateY = 60, duration = 800 } = options;
    const ref = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(node); // Only animate once
                }
            },
            { threshold }
        );

        observer.observe(node);

        return () => {
            observer.unobserve(node);
        };
    }, [threshold]);

    const style: CSSProperties = {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : `translateY(${translateY}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
        willChange: "opacity, transform",
    };

    return { ref, style };
}
