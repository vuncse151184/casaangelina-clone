"use client";

import { useEffect, useState } from "react";
import useScrollFadeIn from "../../hooks/useScrollFadeIn";
import { useTranslation } from "../../i18n/I18nContext";
import { getExperiences } from "../../lib/strapi";
import type { ExperienceData } from "../../lib/types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface Experience {
    key: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    href: string;
}

const DEFAULT_EXPERIENCES: Experience[] = [
    {
        key: "chefOnBoard",
        title: "Chef On Board",
        subtitle: "Culinary Journey",
        description: "A unique culinary experience aboard a private yacht, with a dedicated chef preparing exquisite dishes.",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
        href: "/experiences/chef-on-board",
    },
    {
        key: "fineDriving",
        title: "Fine Driving",
        subtitle: "Amalfi Coast Tour",
        description: "Explore the breathtaking Amalfi Coast in style with a curated driving experience.",
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
        href: "/experiences/fine-driving",
    },
    {
        key: "romanceRetreat",
        title: "Romance Retreat",
        subtitle: "Couples Experience",
        description: "An exclusive retreat designed for couples seeking a romantic getaway on the coast.",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        href: "/experiences/romance-retreat",
    },
    {
        key: "bodySoul",
        title: "Body & Soul",
        subtitle: "Wellness Journey",
        description: "A holistic wellness experience combining spa treatments, yoga, and mindful activities.",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
        href: "/experiences/body-soul",
    },
];

function mapApiToExperience(item: ExperienceData): Experience {
    const imageUrl = item.image
        ? `${STRAPI_URL}${item.image.url}`
        : "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800";
    return {
        key: item.documentId,
        title: item.title,
        subtitle: item.subtitle || "",
        description: item.description || "",
        image: imageUrl,
        href: item.href || "#",
    };
}

function ExperienceBlock({ exp, index }: { exp: Experience; index: number }) {
    const imageFade = useScrollFadeIn({ delay: 0, translateY: 70 });
    const contentFade = useScrollFadeIn({ delay: 150, translateY: 50 });

    return (
        <div
            className={`grid lg:grid-cols-2 gap-6 md:gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
        >
            {/* Image */}
            <div
                ref={imageFade.ref}
                style={imageFade.style}
                className={`relative overflow-hidden ${index % 2 === 1 ? "lg:order-2" : ""
                    }`}
            >
                <div className="aspect-[16/10] overflow-hidden group">
                    <img
                        src={exp.image}
                        alt={exp.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                </div>
                {/* Decorative Frame */}
                <div
                    className={`absolute -z-10 w-full h-full border-2 border-[#e8e0d8] ${index % 2 === 0
                        ? "-bottom-4 -right-4"
                        : "-bottom-4 -left-4"
                        }`}
                />
            </div>

            {/* Content */}
            <div
                ref={contentFade.ref}
                style={contentFade.style}
                className={`${index % 2 === 1 ? "lg:order-1 lg:text-right" : ""
                    }`}
            >
                <span className="text-[#d4c4b0] uppercase tracking-[0.2em] text-sm">
                    {exp.subtitle}
                </span>
                <h3
                    className="text-[#8b7355] font-light uppercase tracking-[0.1em] mt-4 mb-6"
                    style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)" }}
                >
                    {exp.title}
                </h3>
                <p className="text-[#a89680] leading-relaxed mb-6 md:mb-8 max-w-md text-sm md:text-base">
                    {exp.description}
                </p>
                <a
                    href={exp.href}
                    className="inline-flex items-center gap-3 text-[#8b7355] uppercase tracking-[0.15em] text-sm hover:text-[#6b5340] transition-colors group"
                >
                    <span>More Details</span>
                    <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-2"
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
                </a>
            </div>
        </div>
    );
}

export default function ExperiencesSection() {
    const { t } = useTranslation();
    const [experiences, setExperiences] = useState<Experience[]>(DEFAULT_EXPERIENCES);

    useEffect(() => {
        getExperiences()
            .then((res) => {
                if (res.data && res.data.length > 0) {
                    setExperiences(res.data.map(mapApiToExperience));
                }
            })
            .catch(() => { /* fallback to hardcoded */ });
    }, []);

    const headingFade = useScrollFadeIn({ delay: 0 });
    const dividerFade = useScrollFadeIn({ delay: 100 });

    return (
        <section className="relative min-h-screen bg-white py-12 md:py-24 px-4 md:px-6 lg:px-16 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 md:mb-20">
                    <h2
                        ref={headingFade.ref}
                        style={{ ...headingFade.style, fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
                        className="text-[#d4c4b0] font-light uppercase tracking-[0.5em] mb-4"
                    >
                        {t("experiences.heading")}
                    </h2>
                    <div ref={dividerFade.ref} style={dividerFade.style} className="w-16 h-px bg-[#d4c4b0] mx-auto" />
                </div>

                {/* Experiences Grid - Alternating Layout */}
                <div className="space-y-12 md:space-y-24">
                    {experiences.map((exp, index) => (
                        <ExperienceBlock key={exp.key} exp={exp} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
