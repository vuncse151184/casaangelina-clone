"use client";

import { useState, useEffect } from "react";
import { getResorts } from "../lib/strapi";
import type { Resort } from "../lib/types";
import { useTranslation } from "../i18n/I18nContext";

export const dynamic = "force-dynamic";

export default function RoomsPage() {
    const { t } = useTranslation();
    const [resorts, setResorts] = useState<Resort[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getResorts("gallery")
            .then((res) => setResorts(res.data))
            .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative h-[50vh] bg-[#f5f0eb] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920"
                        alt="Luxury rooms"
                        className="w-full h-full object-cover opacity-40"
                    />
                </div>
                <div className="relative z-10 text-center">
                    <h1
                        className="text-[#8b7355] font-light uppercase tracking-[0.3em]"
                        style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
                    >
                        {t("rooms.pageTitle")}
                    </h1>
                    <div className="w-16 h-px bg-[#d4c4b0] mx-auto mt-6" />
                </div>
            </section>

            {/* Rooms Grid */}
            <section className="py-20 px-6 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    {error ? (
                        <div className="text-center py-20">
                            <p className="text-[#a89680]">{error}</p>
                            <p className="text-sm text-[#d4c4b0] mt-2">
                                {t("rooms.errorHint")}
                            </p>
                        </div>
                    ) : resorts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-[#a89680]">{t("rooms.noRooms")}</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {resorts.map((resort) => (
                                <a
                                    key={resort.documentId}
                                    href={`/rooms/${resort.slug || resort.documentId}`}
                                    className="group"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden mb-6">
                                        {resort.gallery && resort.gallery[0] ? (
                                            <img
                                                src={resort.gallery[0].url}
                                                alt={resort.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#f5f0eb] flex items-center justify-center">
                                                <span className="text-[#d4c4b0]">{t("rooms.noImage")}</span>
                                            </div>
                                        )}
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-[#8b7355] font-light text-xl uppercase tracking-[0.1em] mb-2 group-hover:text-[#6b5340] transition-colors">
                                        {resort.name}
                                    </h3>
                                    {resort.location && (
                                        <p className="text-[#a89680] text-sm mb-3">{resort.location}</p>
                                    )}
                                    <div className="flex items-center gap-2 text-[#d4c4b0] text-sm uppercase tracking-[0.1em]">
                                        <span>{t("rooms.viewDetails")}</span>
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
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
