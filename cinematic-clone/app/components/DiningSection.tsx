"use client";

import { useEffect, useState } from "react";
import useScrollFadeIn from "../hooks/useScrollFadeIn";
import { useTranslation } from "../i18n/I18nContext";
import { getDiningVenues } from "../lib/strapi";
import type { DiningVenueData } from "../lib/types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface DiningVenue {
    key: string;
    name: string;
    tagline: string;
    image: string;
    href: string;
}

const DEFAULT_VENUES: DiningVenue[] = [
    {
        key: "unPiano",
        name: "Un Piano Nel Cielo",
        tagline: "A Michelin star experience above the clouds",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
        href: "/dining/un-piano-nel-cielo",
    },
    {
        key: "seascape",
        name: "Seascape",
        tagline: "Mediterranean flavors with ocean views",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600",
        href: "/dining/seascape",
    },
    {
        key: "cocktailBar",
        name: "Cocktail Bar",
        tagline: "Crafted cocktails in an intimate setting",
        image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600",
        href: "/dining/cocktail-bar",
    },
    {
        key: "wineCellar",
        name: "Wine Cellar",
        tagline: "A curated selection of the finest wines",
        image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600",
        href: "/dining/wine-cellar",
    },
    {
        key: "breakfast",
        name: "Breakfast",
        tagline: "Start your day with a Mediterranean feast",
        image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600",
        href: "/dining/breakfast",
    },
    {
        key: "rooftop",
        name: "Rooftop",
        tagline: "Dining under the stars",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
        href: "/dining/rooftop",
    },
];

function mapApiToVenue(item: DiningVenueData): DiningVenue {
    const imageUrl = item.image
        ? `${STRAPI_URL}${item.image.url}`
        : "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600";
    return {
        key: item.slug || item.documentId,
        name: item.name,
        tagline: item.tagline || "",
        image: imageUrl,
        href: item.href || `/dining/${item.slug}`,
    };
}

function DiningCard({ venue, index }: { venue: DiningVenue; index: number }) {
    const cardFade = useScrollFadeIn<HTMLAnchorElement>({ delay: index * 100, translateY: 50 });

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
                    alt={venue.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-500 group-hover:from-black/50" />
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-[#8b7355] font-light text-lg uppercase tracking-[0.1em] mb-2 group-hover:text-[#6b5340] transition-colors duration-300">
                    {venue.name}
                </h3>
                <p className="text-[#a89680] max-w-[90%] line-clamp-2 text-sm leading-relaxed group-hover:text-[#8b7355] transition-colors duration-300">
                    {venue.tagline}
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
    const [venues, setVenues] = useState<DiningVenue[]>(DEFAULT_VENUES);

    useEffect(() => {
        getDiningVenues()
            .then((res) => {
                if (res.data && res.data.length > 0) {
                    setVenues(res.data.map(mapApiToVenue));
                }
            })
            .catch(() => { /* fallback to hardcoded */ });
    }, []);

    const headingFade = useScrollFadeIn({ delay: 0 });
    const descFade = useScrollFadeIn({ delay: 100 });

    return (
        <section className="relative min-h-screen bg-[#eae6e0] py-24 px-6 lg:px-16">
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
