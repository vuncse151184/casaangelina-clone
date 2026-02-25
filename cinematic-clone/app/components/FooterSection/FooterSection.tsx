"use client";

import { useEffect, useRef, useState } from "react";
import useScrollFadeIn from "../../hooks/useScrollFadeIn";
import { useTranslation } from "../../i18n/I18nContext";
import { getSiteConfig, getWeather } from "../../lib/strapi";
import type { SiteConfig, PartnerData, WeatherData } from "../../lib/types";
import "./FooterSection.css";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

const DEFAULT_PARTNERS: PartnerData[] = [
    { name: "lhw", src: "https://www.casangelina.com/wp-content/themes/casangelina/assets/images/partners/lhw.png" },
    { name: "virtuoso", src: "https://www.casangelina.com/wp-content/themes/casangelina/assets/images/partners/virtuoso.png" },
    { name: "michelin", src: "https://www.casangelina.com/wp-content/themes/casangelina/assets/images/partners/michelin2025.png", href: "https://guide.michelin.com/at/en/campania/praiano/restaurant/un-piano-nel-cielo" },
    { name: "michelin key", src: "https://www.casangelina.com/wp-content/themes/casangelina/assets/images/partners/michelinkey.png", href: "https://guide.michelin.com/en/hotels-stays/praiano/casa-angelina-1201" },
    { name: "ae", src: "https://www.casangelina.com/wp-content/themes/casangelina/assets/images/partners/american_express.png" },
    { name: "traveller", src: "https://www.casangelina.com/wp-content/themes/casangelina/assets/images/partners/serandipians.png" },
];

const DEFAULT_SOCIAL = {
    facebook: "https://www.facebook.com/CasaAngelinaHotel",
    instagram: "http://instagram.com/casaangelinalifestyle",
    twitter: "https://twitter.com/Casangelina",
};

/** Convert wind degrees to a compass direction string */
function getWindDirection(deg: number): string {
    const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
        "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return dirs[Math.round(deg / 22.5) % 16];
}

/** Classify wind speed (m/s) into a human-readable label */
function getWindLabel(speed: number): string {
    if (speed < 1.5) return "calm";
    if (speed < 3.4) return "weak";
    if (speed < 5.5) return "gentle";
    if (speed < 8) return "moderate";
    if (speed < 10.8) return "fresh";
    return "strong";
}

/** Get ordinal suffix for a day number */
function getOrdinalSuffix(day: number): string {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

export default function FooterSection() {
    const { t } = useTranslation();
    const [activeDay, setActiveDay] = useState(0);
    const [activeHour, setActiveHour] = useState(5);
    const [config, setConfig] = useState<SiteConfig | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);

    // Scroll-driven horizontal animation (same pattern as InstagramSection)
    const wrapperRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const footerLeftRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    const partnersFade = useScrollFadeIn({ delay: 400, translateY: 30 });

    // Detect mobile for disabling horizontal scroll
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        getSiteConfig()
            .then((res) => setConfig(res.data))
            .catch(() => { /* fallback to hardcoded */ });

        getWeather()
            .then((res) => setWeather(res.data))
            .catch(() => { /* fallback to defaults */ });
    }, []);

    const partners = config?.partners ?? DEFAULT_PARTNERS;
    const social = config?.social_links ?? DEFAULT_SOCIAL;
    const phone = config?.phone ?? "+84 338 010 426";
    const fax = config?.fax ?? " ";
    const cin = config?.cin ?? " ";
    const EMAIL_ADDRESS = "contact.me.nguyenvudev@gmail.com"
    const copyright = config?.copyright ?? "© CasAngelina 2026 | all rights reserved";
    const footerBg = config?.footer_image
        ? `${STRAPI_URL}${config.footer_image.url}`
        : "https://www.casangelina.com/wp-content/themes/casangelina/assets/images/home/footer.jpg";

    // Dynamic date
    const now = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const currentDayName = dayNames[now.getDay()];
    const currentDate = now.getDate();
    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();

    // Build days of week starting from today
    const days = ["Today"];
    for (let i = 1; i <= 6; i++) {
        const future = new Date(now);
        future.setDate(now.getDate() + i);
        days.push(dayNames[future.getDay()].slice(0, 3));
    }

    // Weather-derived values (with fallbacks)
    const temperature = weather ? Math.round(weather.temperature.current) : 12;
    const weatherDesc = weather?.weather.description ?? "weak rain";
    const weatherIconUrl = weather?.weather.iconUrl
        ?? "https://www.casangelina.com/wp-content/themes/casangelina/assets/images/weather/9.png";
    const windSpeed = weather?.wind.speed ?? 2.7;
    const windDeg = weather?.wind.deg ?? 225;
    const windDir = getWindDirection(windDeg);
    const windLabel = getWindLabel(windSpeed);
    const humidity = weather?.humidity ?? 72;

    const hours = [
        { time: "00:00", icon: "n1" },
        { time: "03:00", icon: "4" },
        { time: "06:00", icon: "9" },
        { time: "09:00", icon: "4" },
        { time: "12:00", icon: "10" },
        { time: "15:00", icon: "9" },
        { time: "18:00", icon: "4" },
        { time: "21:00", icon: "4" },
    ];

    useEffect(() => {
        if (!wrapperRef.current || !containerRef.current || isMobile) return;

        const wrapper = wrapperRef.current;
        const container = containerRef.current;

        let currentX = 0;      // current animated value
        let targetX = 0;       // target based on scroll
        let rafId: number;

        const ease = 0.08;     // smaller = smoother (0.05–0.12 sweet spot)

        const updateTarget = () => {
            const rect = wrapper.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const scrollableDistance = wrapper.offsetHeight - windowHeight;
            const scrolledAmount = -rect.top;

            if (scrolledAmount <= 0) {
                targetX = 0;
                return;
            }

            if (scrolledAmount >= scrollableDistance) {
                targetX = container.scrollWidth - window.innerWidth;
                return;
            }

            const progress = scrolledAmount / scrollableDistance;
            const maxScroll = container.scrollWidth - window.innerWidth;

            targetX = progress * maxScroll;
        };

        const footerLeft = footerLeftRef.current;

        const animate = () => {
            // LERP interpolation
            currentX += (targetX - currentX) * ease;

            container.style.transform = `translate3d(-${currentX}px, 0, 0)`;

            // Counter-translate footerLeft so it stays in place
            if (footerLeft) {
                footerLeft.style.transform = `translate3d(${currentX}px, 0, 0)`;
            }

            rafId = requestAnimationFrame(animate);
        };

        const handleScroll = () => {
            updateTarget();
        };

        // Start loop
        animate();

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll, { passive: true });

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [isMobile]);

    return (
        <div ref={wrapperRef} className="relative" style={{ height: isMobile ? 'auto' : '150vh' }}>
            <div id="footerSticky">
                {/* Horizontal scroll container */}
                <div
                    ref={containerRef}
                    className="footerHorizontalContainer"
                >
                    {/* ========== PANEL 1: FOOTER MAIN ========== */}
                    <div className="footerPanel" id="footerMain">
                        {/* Background Image */}
                        <div className="mainBackground">
                            <img
                                alt="Casa Angelina footer"
                                src={footerBg}
                            />
                        </div>

                        {/* Content */}
                        <div className="mainContainer">
                            {/* Left Side */}
                            <div id="footerLeft" ref={footerLeftRef}>
                                {/* Logo */}
                                <div id="footerLogo">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 854.56 135.26">
                                        <text
                                            x="360"
                                            y="90"
                                            textAnchor="middle"
                                            fill="#ffffff"
                                            fontFamily="Georgia, serif"
                                            fontSize="70"
                                            fontWeight="300"
                                            letterSpacing="12"
                                        >
                                            CASA ANGELINA
                                        </text>
                                    </svg>
                                </div>

                                {/* Address & Contact */}
                                <div id="footerInfo">
                                    <p>
                                        <a href="https://goo.gl/maps/cc6LjHbEs9wj742H8" target="_blank" rel="noopener noreferrer">
                                            Clone từ casangelina.com bởi Vũ Nguyễn :D <br />
                                        </a>
                                        Phone: <a href={`tel:${phone}`}>{phone}</a><br />
                                        Email: <a href={`mailto:${EMAIL_ADDRESS}`}>{EMAIL_ADDRESS}</a><br />
                                    </p>
                                    {/* Right Side - Social Icons */}
                                    <div id="footerRight">
                                        <div className="socials">
                                            {/* Facebook */}
                                            <a className="fb" target="_blank" rel="noopener noreferrer" href={"https://www.facebook.com/vu.nguyen.699111/"}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                    <path fill="#FFFFFF" d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                                </svg>
                                            </a>
                                            {/* Instagram */}
                                            <a className="ig" target="_blank" rel="noopener noreferrer" href={social.instagram || "#"}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                    <path fill="#FFFFFF" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                                </svg>
                                            </a>
                                            {/* Twitter */}
                                            <a className="tw" target="_blank" rel="noopener noreferrer" href={social.twitter || "#"}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                    <path fill="#FFFFFF" d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Copyright */}
                                <div id="copyright">
                                    <p>{copyright}</p>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* ========== PANEL 2: FOOTER DATA ========== */}
                    <div className={`footerPanel ${isMobile ? '' : '!w-[50vw]'}`} id="footerData">
                        <div id="footerDataTop">
                            {/* Date — now dynamic */}
                            <div id="date" className="weatherContainer">
                                <h4 className="year">{currentYear}</h4>
                                <h4 className="day">
                                    <span className="ext-day">{currentDayName}</span>
                                    <span className="ext-date">{currentDate}{getOrdinalSuffix(currentDate)} {currentMonth}</span>
                                </h4>
                            </div>

                            {/* Days of Week */}
                            <div id="days" className="halfMargin">
                                <div className="weatherContainer">
                                    {days.map((day, index) => (
                                        <div
                                            key={index}
                                            className={`day_name flex text-center ${index === activeDay ? "active" : ""}`}
                                            onClick={() => setActiveDay(index)}
                                        >
                                            <div className="day_back" />
                                            <p>{day}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Weather — now from API */}
                            <div id="weather" className="halfMargin">
                                <div id="weatherBox">
                                    {/* Weather Icons Row */}
                                    <div className="meteo_row">
                                        <div className="weatherContainer">
                                            <div className="wind_ico meteo_col">
                                                <div className="meteo_ico_big">
                                                    <img alt="Wind" src="https://www.casangelina.com/wp-content/themes/casangelina/assets/images/weather/wind/2.png" />
                                                </div>
                                                <p className="meteo_stats">{windLabel}</p>
                                            </div>
                                            <div className="weather_ico meteo_col">
                                                <div className="meteo_ico_big">
                                                    <img alt="Weather" src={weatherIconUrl} />
                                                </div>
                                                <p className="meteo_stats">{weatherDesc}</p>
                                            </div>
                                            <div className="sea_ico meteo_col">
                                                <div className="meteo_ico_big">
                                                    <img alt="Sea" src="https://www.casangelina.com/wp-content/themes/casangelina/assets/images/weather/sea/4.png" />
                                                </div>
                                                <p className="meteo_stats">slight</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Weather Data Row */}
                                    <div className="meteo_row">
                                        <div className="weatherContainer">
                                            <div className="data meteo_col">
                                                <div className="wind_direction">
                                                    <img alt="Wind direction" src="https://www.casangelina.com/wp-content/themes/casangelina/assets/images/weather/wind_dir.png" />
                                                    <p className="meteo_small">{windDir}</p>
                                                </div>
                                                <div className="wind_speed">
                                                    <img alt="Wind speed" src="https://www.casangelina.com/wp-content/themes/casangelina/assets/images/weather/wind_speed.png" />
                                                    <p className="meteo_small">{windSpeed.toFixed(1)} m/s</p>
                                                </div>
                                            </div>
                                            <div className="data meteo_col">
                                                <p className="temp_text">
                                                    <span className="temp_num">{temperature}</span>{" "}
                                                    <span className="temp_deg">°</span>
                                                </p>
                                            </div>
                                            <div className="data meteo_col">
                                                <div className="wave_height">
                                                    <img alt="Humidity" src="https://www.casangelina.com/wp-content/themes/casangelina/assets/images/weather/wave_height.png" />
                                                    <p className="meteo_small">{humidity}%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hourly Timeline */}
                                <div id="hourlyBox">
                                    <div className="hourly_row">
                                        <div className="weatherContainer">
                                            {hours.map((hour, index) => (
                                                <div
                                                    key={index}
                                                    className={`hour_box ${index === activeHour ? "active" : ""}`}
                                                    onClick={() => setActiveHour(index)}
                                                >
                                                    <div className="hour_ico">
                                                        <img
                                                            alt={`Weather at ${hour.time}`}
                                                            src={`https://www.casangelina.com/wp-content/themes/casangelina/assets/images/weather/${hour.icon}.png`}
                                                        />
                                                    </div>
                                                    <div className="separator" />
                                                    <div className="active_line" />
                                                    <div className="hour_text">
                                                        <p>{hour.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Partners */}
                        <div id="footerDataBottom" ref={partnersFade.ref} style={partnersFade.style}>
                            <div className="weatherContainer">
                                {partners.map((partner, index) =>
                                    partner.href ? (
                                        <a
                                            key={index}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`partner ${partner.name}`}
                                            href={partner.href}
                                        >
                                            <img alt={partner.name} src={partner.src} />
                                        </a>
                                    ) : (
                                        <div key={index} className={`partner ${partner.name}`}>
                                            <img alt={partner.name} src={partner.src} />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
