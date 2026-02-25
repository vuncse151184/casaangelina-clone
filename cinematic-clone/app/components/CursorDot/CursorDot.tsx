"use client";

import { useEffect, useRef, useState } from "react";

interface CursorDotProps {
    visible: boolean;
}

export default function CursorDot({ visible }: CursorDotProps) {
    const dotRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef({ x: 0, y: 0 });
    const currentRef = useRef({ x: 0, y: 0 });
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(hover: none)");
        setIsTouchDevice(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        if (isTouchDevice) return;

        let rafId: number;

        const onMove = (e: MouseEvent) => {
            targetRef.current.x = e.clientX;
            targetRef.current.y = e.clientY;
        };
        window.addEventListener("mousemove", onMove, { passive: true });

        const animate = () => {
            const cur = currentRef.current;
            const tgt = targetRef.current;

            cur.x += (tgt.x - cur.x) * 0.18;
            cur.y += (tgt.y - cur.y) * 0.18;

            if (dotRef.current) {
                dotRef.current.style.transform =
                    `translate3d(${cur.x}px, ${cur.y}px, 0)`;
            }
            rafId = requestAnimationFrame(animate);
        };
        rafId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("mousemove", onMove);
        };
    }, [isTouchDevice]);

    if (isTouchDevice) return null;

    return (
        <div
            ref={dotRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 9999,
                pointerEvents: "none",
                willChange: "transform",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.3s ease",
            }}
        >
            <div
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#8b7355",
                    transform: "translate(-50%, -50%)",
                }}
            />
        </div>
    );
}
