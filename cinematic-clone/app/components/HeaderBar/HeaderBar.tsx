"use client";

import { useTranslation } from "../../i18n/I18nContext";
import type { Locale } from "../../i18n/I18nContext";
import "./HeaderBar.css";

interface HeaderBarProps {
    isDark?: boolean;
    onMenuToggle: () => void;
    isMenuOpen: boolean;
    onBookNow?: () => void;
}

export default function HeaderBar({ isDark = false, onMenuToggle, isMenuOpen, onBookNow }: HeaderBarProps) {
    const { locale, setLocale } = useTranslation();

    return (
        <header className={`header-bar ${isDark ? "header-dark" : ""}`}>
            {/* Left side: Menu + Logo + Language */}
            <div className="header-left">
                {/* Hamburger */}
                <button
                    className={`header-menu-btn ${isMenuOpen ? "active" : ""}`}
                    onClick={onMenuToggle}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                    <span className="hm-line" />
                    <span className="hm-line" />
                    <span className="hm-line" />
                </button>

                {/* Logo */}
                <a href="/" className="header-logo">
                    <svg viewBox="0 0 340 40" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
                        <text x="0" y="30" fontFamily="'Playfair Display', Georgia, serif" fontStyle="italic" fontSize="40" fontWeight="400" fill="currentColor" letterSpacing="1">
                            Casa Angelina
                        </text>
                    </svg>
                </a>

                {/* Language Switch */}
                <div className="header-lang">
                    <button
                        title="Chuyển sang tiếng anh"
                        className={`lang-btn ${locale === "en" ? "active" : ""}`}
                        onClick={() => setLocale("en" as Locale)}
                    >
                        English
                    </button>
                    <button
                        title="Change to Vietnamese"
                        className={`lang-btn ${locale === "vi" ? "active" : ""}`}
                        onClick={() => setLocale("vi" as Locale)}
                    >
                        Tiếng việt
                    </button>
                </div>
            </div>

            {/* Right side: Socials + Book Now */}
            <div className="header-right">
                <div className="header-socials">
                    <a href="https://www.facebook.com/vu.nguyen.699111/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                    </a>
                </div>
                <button className="header-book-btn" onClick={onBookNow}>
                    book now
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                    </svg>
                </button>
            </div>
        </header>
    );
}
