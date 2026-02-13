"use client";

import { useEffect, useRef, useState } from "react";
import useScrollFadeIn from "../hooks/useScrollFadeIn";
import { useTranslation } from "../i18n/I18nContext";
import "./FooterSection.css";

export default function FooterSection() {
    const { t } = useTranslation();
    const [activeDay, setActiveDay] = useState(0);
    const [activeHour, setActiveHour] = useState(5);

    // Scroll-driven horizontal animation (same pattern as InstagramSection)
    const wrapperRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollX, setScrollX] = useState(0);

    const partnersFade = useScrollFadeIn({ delay: 400, translateY: 30 });

    const days = ["Today", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];
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

    const partners = [
        { name: "lhw", src: "https://www.casangelina.com/wp-content/themes/casangelina/assets/images/partners/lhw.png" },
        { name: "virtuoso", src: "https://www.casangelina.com/wp-content/themes/casangelina/assets/images/partners/virtuoso.png" },
        { name: "michelin", src: "https://www.casangelina.com/wp-content/themes/casangelina/assets/images/partners/michelin2025.png", href: "https://guide.michelin.com/at/en/campania/praiano/restaurant/un-piano-nel-cielo" },
        { name: "michelin key", src: "https://www.casangelina.com/wp-content/themes/casangelina/assets/images/partners/michelinkey.png", href: "https://guide.michelin.com/en/hotels-stays/praiano/casa-angelina-1201" },
        { name: "ae", src: "https://www.casangelina.com/wp-content/themes/casangelina/assets/images/partners/american_express.png" },
        { name: "traveller", src: "https://www.casangelina.com/wp-content/themes/casangelina/assets/images/partners/serandipians.png" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            if (!wrapperRef.current || !containerRef.current) return;

            const wrapper = wrapperRef.current;
            const rect = wrapper.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const scrollableDistance = wrapper.offsetHeight - windowHeight;
            const scrolledAmount = -rect.top;

            if (scrolledAmount >= 0 && scrolledAmount <= scrollableDistance) {
                const scrollProgress = scrolledAmount / scrollableDistance;

                const containerWidth = containerRef.current.scrollWidth;
                const visibleWidth = window.innerWidth;
                const maxScroll = Math.max(0, containerWidth - visibleWidth);

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
        window.addEventListener("resize", handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    return (
        <div ref={wrapperRef} className="relative" style={{ height: '300vh' }}>
            <div id="footerSticky">
                {/* Horizontal scroll container */}
                <div
                    ref={containerRef}
                    className="footerHorizontalContainer"
                    style={{
                        transform: `translateX(-${scrollX}px)`,
                    }}
                >
                    {/* ========== PANEL 1: FOOTER MAIN ========== */}
                    <div className="footerPanel" id="footerMain">
                        {/* Background Image */}
                        <div className="mainBackground">
                            <img
                                alt="Casa Angelina footer"
                                src="https://www.casangelina.com/wp-content/themes/casangelina/assets/images/home/footer.jpg"
                            />
                        </div>

                        {/* Content */}
                        <div className="mainContainer">
                            {/* Left Side */}
                            <div id="footerLeft" style={{ transform: `translateX(${scrollX}px)` }}>
                                {/* Logo */}
                                <div id="footerLogo">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 854.56 135.26">
                                        <text
                                            x="427.28"
                                            y="90"
                                            textAnchor="middle"
                                            fill="#ffffff"
                                            fontFamily="Georgia, serif"
                                            fontSize="80"
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
                                            Via Capriglione, 147<br />
                                            84010 Praiano<br />
                                            Amalfi Coast, SA<br />
                                            ITALY
                                        </a><br />
                                        ph <a href="tel:+390898131333">+39 089 8131333</a><br />
                                        fax +39 089 874266<br /><br />
                                        CIN: IT065102A14H5PUG5R
                                    </p>
                                </div>

                                {/* Copyright */}
                                <div id="copyright">
                                    <p>© Casa Angelina 2026 | all rights reserved</p>
                                </div>
                            </div>

                            {/* Right Side - Social Icons */}
                            <div id="footerRight">
                                <div className="socials">
                                    {/* Facebook */}
                                    <a className="fb" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/CasaAngelinaHotel">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="#FFFFFF" d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                        </svg>
                                    </a>
                                    {/* Instagram */}
                                    <a className="ig" target="_blank" rel="noopener noreferrer" href="http://instagram.com/casaangelinalifestyle">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="#FFFFFF" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                    {/* Twitter */}
                                    <a className="tw" target="_blank" rel="noopener noreferrer" href="https://twitter.com/Casangelina">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path fill="#FFFFFF" d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ========== PANEL 2: FOOTER DATA ========== */}
                    <div className="footerPanel !w-[50vw]" id="footerData">
                        <div id="footerDataTop">
                            {/* Date */}
                            <div id="date" className="weatherContainer">
                                <h4 className="year">2026</h4>
                                <h4 className="day">
                                    <span className="ext-day">Tuesday</span>{" "}
                                    <span className="ext-date">10th February</span>
                                </h4>
                            </div>

                            {/* Days of Week */}
                            <div id="days" className="halfMargin">
                                <div className="weatherContainer">
                                    {days.map((day, index) => (
                                        <div
                                            key={index}
                                            className={`day_name ${index === activeDay ? "active" : ""}`}
                                            onClick={() => setActiveDay(index)}
                                        >
                                            <div className="day_back" />
                                            <p>{day}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Weather */}
                            <div id="weather" className="halfMargin">
                                <div id="weatherBox">
                                    {/* Weather Icons Row */}
                                    <div className="meteo_row">
                                        <div className="weatherContainer">
                                            <div className="wind_ico meteo_col">
                                                <div className="meteo_ico_big">
                                                    <img alt="Wind" src="https://www.casangelina.com/wp-content/themes/casangelina/assets/images/weather/wind/2.png" />
                                                </div>
                                                <p className="meteo_stats">weak</p>
                                            </div>
                                            <div className="weather_ico meteo_col">
                                                <div className="meteo_ico_big">
                                                    <img alt="Weather" src="https://www.casangelina.com/wp-content/themes/casangelina/assets/images/weather/9.png" />
                                                </div>
                                                <p className="meteo_stats">weak rain</p>
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
                                                    <p className="meteo_small">SW</p>
                                                </div>
                                                <div className="wind_speed">
                                                    <img alt="Wind speed" src="https://www.casangelina.com/wp-content/themes/casangelina/assets/images/weather/wind_speed.png" />
                                                    <p className="meteo_small">2.7 m/s</p>
                                                </div>
                                            </div>
                                            <div className="data meteo_col">
                                                <p className="temp_text">
                                                    <span className="temp_num">12</span>{" "}
                                                    <span className="temp_deg">°</span>
                                                </p>
                                            </div>
                                            <div className="data meteo_col">
                                                <div className="wave_height">
                                                    <img alt="Wave height" src="https://www.casangelina.com/wp-content/themes/casangelina/assets/images/weather/wave_height.png" />
                                                    <p className="meteo_small">0.951 M</p>
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
        </div>
    );
}
