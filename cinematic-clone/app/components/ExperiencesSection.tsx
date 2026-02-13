"use client";

import useScrollFadeIn from "../hooks/useScrollFadeIn";
import { useTranslation } from "../i18n/I18nContext";

interface Experience {
    key: string;
    image: string;
    href: string;
}

function ExperienceBlock({ exp, index }: { exp: Experience; index: number }) {
    const imageFade = useScrollFadeIn({ delay: 0, translateY: 70 });
    const contentFade = useScrollFadeIn({ delay: 150, translateY: 50 });
    const { t } = useTranslation();

    return (
        <div
            className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
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
                        alt={t(`experiences.items.${exp.key}.title`)}
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
                    {t(`experiences.items.${exp.key}.subtitle`)}
                </span>
                <h3
                    className="text-[#8b7355] font-light uppercase tracking-[0.1em] mt-4 mb-6"
                    style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)" }}
                >
                    {t(`experiences.items.${exp.key}.title`)}
                </h3>
                <p className="text-[#a89680] leading-relaxed mb-8 max-w-md">
                    {t(`experiences.items.${exp.key}.description`)}
                </p>
                <a
                    href={exp.href}
                    className="inline-flex items-center gap-3 text-[#8b7355] uppercase tracking-[0.15em] text-sm hover:text-[#6b5340] transition-colors group"
                >
                    <span>{t("experiences.moreDetails")}</span>
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

    const experiences: Experience[] = [
        {
            key: "chefOnBoard",
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
            href: "/experiences/chef-on-board",
        },
        {
            key: "fineDriving",
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
            href: "/experiences/fine-driving",
        },
        {
            key: "romanceRetreat",
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
            href: "/experiences/romance-retreat",
        },
        {
            key: "bodySoul",
            image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
            href: "/experiences/body-soul",
        },
    ];

    const headingFade = useScrollFadeIn({ delay: 0 });
    const dividerFade = useScrollFadeIn({ delay: 100 });

    return (
        <section className="relative min-h-screen bg-white py-24 px-6 lg:px-16 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
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
                <div className="space-y-24">
                    {experiences.map((exp, index) => (
                        <ExperienceBlock key={exp.key} exp={exp} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
