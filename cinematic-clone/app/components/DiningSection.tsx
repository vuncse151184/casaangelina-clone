"use client";

import useScrollFadeIn from "../hooks/useScrollFadeIn";
import { useTranslation } from "../i18n/I18nContext";

interface DiningVenue {
    key: string;
    image: string;
    href: string;
}

function DiningCard({ venue, index }: { venue: DiningVenue; index: number }) {
    const cardFade = useScrollFadeIn<HTMLAnchorElement>({ delay: index * 100, translateY: 50 });
    const { t } = useTranslation();

    return (
        <a
            ref={cardFade.ref}
            style={cardFade.style}
            href={venue.href}
            className="group relative overflow-hidden bg-white rounded shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ease-out"
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={venue.image}
                    alt={t(`dining.venues.${venue.key}.name`)}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Subtle bottom gradient — always visible, intensifies on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/50" />
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-[#8b7355] font-light text-lg uppercase tracking-[0.1em] mb-2 group-hover:text-[#6b5340] transition-colors duration-300">
                    {t(`dining.venues.${venue.key}.name`)}
                </h3>
                <p className="text-[#a89680] max-w-[90%] line-clamp-2 text-sm leading-relaxed group-hover:text-[#8b7355] transition-colors duration-300">
                    {t(`dining.venues.${venue.key}.tagline`)}
                </p>
            </div>

            {/* Hover Arrow */}
            <div className="absolute bottom-6 right-6 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <svg
                    className="w-5 h-5 text-[#8b7355]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                </svg>
            </div>
        </a>
    );
}

export default function DiningSection() {
    const { t } = useTranslation();

    const venues: DiningVenue[] = [
        {
            key: "unPiano",
            image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
            href: "/dining/un-piano-nel-cielo",
        },
        {
            key: "seascape",
            image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600",
            href: "/dining/seascape",
        },
        {
            key: "cocktailBar",
            image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600",
            href: "/dining/cocktail-bar",
        },
        {
            key: "wineCellar",
            image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600",
            href: "/dining/wine-cellar",
        },
        {
            key: "breakfast",
            image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600",
            href: "/dining/breakfast",
        },
        {
            key: "rooftop",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
            href: "/dining/rooftop",
        },
    ];

    const headingFade = useScrollFadeIn({ delay: 0 });
    const descFade = useScrollFadeIn({ delay: 100 });

    return (
        <section className="relative min-h-screen bg-[#faf8f5] py-24 px-6 lg:px-16">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2
                        ref={headingFade.ref}
                        style={{ ...headingFade.style, fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
                        className="text-[#d4c4b0] font-light uppercase tracking-[0.5em] mb-4"
                    >
                        {t("dining.heading")}
                    </h2>
                    <p ref={descFade.ref} style={descFade.style} className="text-[#8b7355] max-w-2xl mx-auto leading-relaxed">
                        {t("dining.description")}
                    </p>
                </div>

                {/* Dining Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {venues.map((venue, index) => (
                        <DiningCard key={venue.key} venue={venue} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
