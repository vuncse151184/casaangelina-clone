"use client";

import "./Nav.css";

interface NavItem {
    title: string;
    href: string;
    subtitle?: string;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

interface NavProps {
    isOpen: boolean;
    onClose: () => void;
}

const navSections: NavSection[] = [
    {
        title: "Hotel at a Glance",
        items: [
            { title: "Concept", href: "#concept", subtitle: "sublime modern minimalism" },
            { title: "Location", href: "#location", subtitle: "an oasis of peace and quiet" },
            { title: "Explore Praiano", href: "#explore", subtitle: "Amalfi Coast's best kept secret" },
            { title: "Our Sustainability Journey", href: "#sustainability" },
            { title: "Shop CA", href: "#shop", subtitle: "bring home our world of style" },
        ],
    },
    {
        title: "Suites",
        items: [
            { title: "Angelina Suite", href: "#angelina", subtitle: "the ethos of casa angelina" },
            { title: "Azure Suite", href: "#azure", subtitle: "launched in April 2023" },
            { title: "Vermarine Suite", href: "#vermarine", subtitle: "newly launched in April 2024" },
        ],
    },
    {
        title: "Rooms",
        items: [
            { title: "Grand De Luxe", href: "#grand", subtitle: "our style statement" },
            { title: "Deluxe Corner Sea View", href: "#deluxe", subtitle: "where style and spaciousness converge" },
            { title: "Terrace", href: "#terrace", subtitle: "slow living" },
            { title: "Relaxing", href: "#relaxing", subtitle: "tranquil beauty" },
        ],
    },
    {
        title: "Dining",
        items: [
            { title: "Taste", href: "#taste", subtitle: "a mediterranean feast" },
            { title: "Breakfast", href: "#breakfast", subtitle: "mediterranean mornings" },
            { title: "Un Piano Nel Cielo", href: "#piano", subtitle: "italian fine dining" },
            { title: "Seascape Cocktail Bar", href: "#cocktail", subtitle: "delicious cocktails & stunning views" },
        ],
    },
];

export default function Nav({ isOpen, onClose }: NavProps) {
    return (
        <nav className={`nav-overlay ${isOpen ? "active" : ""}`}>
            {/* Background Video */}
            <div className="nav-video">
                <video autoPlay muted loop playsInline>
                    <source src="/video/home2025fhd.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Dark Overlay */}
            <div className="nav-background" />

            {/* Close Button */}
            <button className="nav-close" onClick={onClose} aria-label="Close menu">
                <svg className="nav-close-circle" viewBox="0 0 38 38">
                    <circle cx="19" cy="19" r="18" strokeWidth="1.3" fill="transparent" />
                </svg>
                <div className="nav-close-icon">
                    <span></span>
                    <span></span>
                </div>
            </button>

            {/* Navigation Content */}
            <div className="nav-inner">
                <div className="nav-content">
                    <div className="nav-scroller">
                        {navSections.map((section, idx) => (
                            <div key={idx} className="nav-section">
                                <div className="nav-section-title">
                                    <span>{section.title}</span>
                                </div>
                                <div className="nav-section-items">
                                    {section.items.map((item, itemIdx) => (
                                        <a
                                            key={itemIdx}
                                            href={item.href}
                                            className="nav-item"
                                            style={{ transitionDelay: `${(idx * 100) + (itemIdx * 50)}ms` }}
                                            onClick={onClose}
                                        >
                                            {item.title}
                                            {item.subtitle && (
                                                <span className="nav-item-subtitle">
                                                    <span>{item.subtitle}</span>
                                                    <svg className="nav-arrow" viewBox="0 0 14.37 14.37">
                                                        <path d="M14.37,7.19c0,0.55-0.45,1-1,1H3.41l4.95,4.95c0.39,0.39,0.39,1.02,0,1.41 c-0.2,0.2-0.45,0.29-0.71,0.29s-0.51-0.1-0.71-0.29L0.29,7.9c-0.39-0.39-0.39-1.02,0-1.41l6.65-6.65c0.39-0.39,1.02-0.39,1.41,0 s0.39,1.02,0,1.41L3.41,6.19h9.96C13.92,6.19,14.37,6.64,14.37,7.19z" />
                                                    </svg>
                                                </span>
                                            )}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="nav-bottom">
                    <div className="nav-socials">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                        </a>
                    </div>
                    <div className="nav-langs">
                        <a href="#" className="active">English</a>
                        <a href="#">Italiano</a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
