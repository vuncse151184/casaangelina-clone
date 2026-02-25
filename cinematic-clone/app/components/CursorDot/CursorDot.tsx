"use client";

import { useEffect, useRef, useState } from "react";

interface CursorDotProps {
    visible: boolean;
}

export default function CursorDot({ visible }: CursorDotProps) {
    const dotRef = useRef<HTMLDivElement>(null);
    const dotPosRef = useRef({ x: 0, y: 0 });
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        // Detect touch-only devices (no hover capability)
        const mq = window.matchMedia("(hover: none)");
        setIsTouchDevice(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        if (isTouchDevice) return; // Skip animation on touch devices

        let animationId: number;
        const lerp = (start: number, end: number, factor: number) =>
            start + (end - start) * factor;

        const handleMouseMove = (e: MouseEvent) => {
            dotPosRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMouseMove);

        const dotPos = { x: 0, y: 0 };
        const animate = () => {
            dotPos.x = lerp(dotPos.x, dotPosRef.current.x, 0.15);
            dotPos.y = lerp(dotPos.y, dotPosRef.current.y, 0.15);
            if (dotRef.current) {
                dotRef.current.style.left = `${dotPos.x}px`;
                dotRef.current.style.top = `${dotPos.y}px`;
            }
            animationId = requestAnimationFrame(animate);
        };
        animationId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isTouchDevice]);

    // Don't render on touch devices
    if (isTouchDevice) return null;

    return (
        <div
            ref={dotRef}
            className="fixed z-[9999] pointer-events-none"
            style={{
                left: 0,
                top: 0,
                transform: 'translate(-50%, -50%)',
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.3s ease',
            }}
        >
            <div className="w-2 h-2 rounded-full bg-[#8b7355]" />
        </div>
    );
}

