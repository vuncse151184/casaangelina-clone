"use client";

import { useEffect, useState } from "react";
import useScrollFadeIn from "../../hooks/useScrollFadeIn";
import { useTranslation } from "../../i18n/I18nContext";
import { getEthos } from "../../lib/strapi";
import type { Ethos, EthosService } from "../../lib/types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

const DEFAULT_SERVICES: EthosService[] = [
    { key: "wellbeing", label: "Wellbeing", href: "/services/wellbeing" },
    { key: "pool", label: "Pool", href: "/services/pool" },
    { key: "beach", label: "Beach", href: "/services/beach" },
    { key: "theGrounds", label: "The Grounds", href: "/services/grounds" },
    { key: "ourBoats", label: "Our Boats", href: "/services/boats" },
    { key: "concierge", label: "Concierge", href: "/services/concierge" },
];

const DEFAULT_IMAGE = "https://glamorousconcept.com/wp-content/uploads/2024/09/piAeY-1.jpg";
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";

export default function EthosSection() {
    const { t } = useTranslation();
    const [ethosData, setEthosData] = useState<Ethos | null>(null);

    useEffect(() => {
        getEthos()
            .then((res) => setEthosData(res.data))
            .catch(() => { /* fallback to hardcoded */ });
    }, []);

    const services = ethosData?.services ?? DEFAULT_SERVICES;
    const imageUrl = ethosData?.image
        ? `${STRAPI_URL}${ethosData.image.url}`
        : DEFAULT_IMAGE;
    const desc1 = ethosData?.description1 ?? t("ethos.desc1");
    const desc2 = ethosData?.description2 ?? t("ethos.desc2");

    const headingFade = useScrollFadeIn({ delay: 0 });
    const desc1Fade = useScrollFadeIn({ delay: 100 });
    const desc2Fade = useScrollFadeIn({ delay: 200 });
    const servicesFade = useScrollFadeIn({ delay: 300 });
    const imageFade = useScrollFadeIn<HTMLImageElement>({ delay: 300, translateY: 120, duration: 1200 });
    const decorFade = useScrollFadeIn({ delay: 400 });

    return (
        <section className="relative min-h-screen bg-white py-12 md:py-24 px-4 md:px-6 lg:px-16">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-start">
                    {/* Left Column - Ethos */}
                    <div>
                        <h2
                            ref={headingFade.ref}
                            style={{ ...headingFade.style, fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
                            className="text-[#d4c4b0] font-light uppercase tracking-[0.25em] md:tracking-[0.5em] mb-4 md:mb-8"
                        >
                            {ethosData?.heading ?? t("ethos.heading")}
                        </h2>
                        <p
                            ref={desc1Fade.ref}
                            style={desc1Fade.style}
                            className="text-[#8b7355] leading-relaxed text-base md:text-lg mb-4 md:mb-8"
                        >
                            {desc1}
                        </p>
                        <p
                            ref={desc2Fade.ref}
                            style={desc2Fade.style}
                            className="text-[#a89680] leading-relaxed"
                        >
                            {desc2}
                        </p>

                        {/* Services Grid */}
                        <div
                            ref={servicesFade.ref}
                            style={servicesFade.style}
                            className="mt-8 md:mt-12 grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4"
                        >
                            {services.map((svc) => (
                                <a
                                    key={svc.key}
                                    href={svc.href}
                                    className="group relative overflow-hidden rounded-sm border border-[#e8e0d8] p-4 transition-all hover:border-[#8b7355] hover:shadow-lg"
                                >
                                    <span className="text-sm uppercase tracking-[0.15em] text-[#8b7355] group-hover:text-[#6b5340] transition-colors">
                                        {svc.label || t(`ethos.services.${svc.key}`)}
                                    </span>
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#d4c4b0] transition-all group-hover:w-full" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div className="relative">
                        <div className="aspect-[3/4] h-[50vh] md:h-[70vh] bg-[#d4c4b0] overflow-hidden">
                            <img
                                src={imageUrl}
                                alt="Minimalist room design"
                                className="w-full  h-full object-cover"
                                ref={imageFade.ref} style={imageFade.style}
                                onError={(e) => {
                                    e.currentTarget.src = FALLBACK_IMAGE;
                                }}
                            />
                        </div>
                        {/* Decorative Line */}
                        <div className="absolute -bottom-4 md:-bottom-8 -left-4 md:-left-8 w-16 md:w-24 h-16 md:h-24 border-l-2 border-b-2 border-[#d4c4b0]" />
                    </div>
                </div>
            </div>


        </section>
    );
}
