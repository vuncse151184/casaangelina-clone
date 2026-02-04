"use client";

import "./MenuToggle.css";

interface MenuToggleProps {
    isOpen: boolean;
    onToggle: () => void;
    className?: string;
}

export default function MenuToggle({
    isOpen,
    onToggle,
    className = "",
}: MenuToggleProps) {
    return (
        <button
            id="menuToggle"
            className={`menu-toggle ${isOpen ? "active" : ""} ${className}`}
            onClick={onToggle}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
        >
            {/* Circle SVG with animated stroke */}
            <svg
                className="circle-path"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 38 38"
            >
                <circle
                    className="circle-stroke"
                    cx="19"
                    cy="19"
                    r="18"
                    strokeWidth="1.3"
                    fill="transparent"
                />
            </svg>

            {/* Hamburger / Close Icon */}
            <div className="menu-icon">
                <span className="line line-1"></span>
                <span className="line line-2"></span>
                <span className="line line-3"></span>
            </div>
        </button>
    );
}
