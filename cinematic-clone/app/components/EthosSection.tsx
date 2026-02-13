"use client";

import useScrollFadeIn from "../hooks/useScrollFadeIn";
import { useTranslation } from "../i18n/I18nContext";

export default function EthosSection() {
    const { t } = useTranslation();

    const serviceKeys = ["wellbeing", "pool", "beach", "theGrounds", "ourBoats", "concierge"] as const;
    const serviceHrefs: Record<string, string> = {
        wellbeing: "/services/wellbeing",
        pool: "/services/pool",
        beach: "/services/beach",
        theGrounds: "/services/grounds",
        ourBoats: "/services/boats",
        concierge: "/services/concierge",
    };

    const headingFade = useScrollFadeIn({ delay: 0 });
    const desc1Fade = useScrollFadeIn({ delay: 100 });
    const desc2Fade = useScrollFadeIn({ delay: 200 });
    const servicesFade = useScrollFadeIn({ delay: 300 });
    const imageFade = useScrollFadeIn({ delay: 200, translateY: 80 });
    const decorFade = useScrollFadeIn({ delay: 400 });

    return (
        <section className="relative min-h-screen bg-white py-24 px-6 lg:px-16">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left Column - Ethos */}
                    <div>
                        <h2
                            ref={headingFade.ref}
                            style={{ ...headingFade.style, fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
                            className="text-[#d4c4b0] font-light uppercase tracking-[0.5em] mb-8"
                        >
                            {t("ethos.heading")}
                        </h2>
                        <p
                            ref={desc1Fade.ref}
                            style={desc1Fade.style}
                            className="text-[#8b7355] leading-relaxed text-lg mb-8"
                        >
                            {t("ethos.desc1")}
                        </p>
                        <p
                            ref={desc2Fade.ref}
                            style={desc2Fade.style}
                            className="text-[#a89680] leading-relaxed"
                        >
                            {t("ethos.desc2")}
                        </p>

                        {/* Services Grid */}
                        <div
                            ref={servicesFade.ref}
                            style={servicesFade.style}
                            className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4"
                        >
                            {serviceKeys.map((key) => (
                                <a
                                    key={key}
                                    href={serviceHrefs[key]}
                                    className="group relative overflow-hidden rounded-sm border border-[#e8e0d8] p-4 transition-all hover:border-[#8b7355] hover:shadow-lg"
                                >
                                    <span className="text-sm uppercase tracking-[0.15em] text-[#8b7355] group-hover:text-[#6b5340] transition-colors">
                                        {t(`ethos.services.${key}`)}
                                    </span>
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#d4c4b0] transition-all group-hover:w-full" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div ref={imageFade.ref} style={imageFade.style} className="relative">
                        <div className="aspect-[3/4] overflow-hidden">
                            <img
                                src="https://glamorousconcept.com/wp-content/uploads/2024/09/piAeY-1.jpg"
                                alt="Minimalist room design"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
                                }}
                            />
                        </div>
                        {/* Decorative Line */}
                        <div className="absolute -bottom-8 -left-8 w-24 h-24 border-l-2 border-b-2 border-[#d4c4b0]" />
                    </div>
                </div>
            </div>

            {/* Decorative Element */}
            <div ref={decorFade.ref} style={decorFade.style} className="absolute bottom-12 left-1/2 -translate-x-1/2">
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#d4c4b0] to-transparent" />
            </div>
        </section>
    );
}
