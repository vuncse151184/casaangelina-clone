"use client";

import { useState, type RefObject } from "react";
import { useTranslation } from "../../i18n/I18nContext";
import NewsletterModal from "../NewsletterModal";

interface ContentSectionProps {
    contentRef: RefObject<HTMLElement | null>;
    contentOpacity: number;
    scrollProgress: number;
    showContent: boolean;
    showLook: boolean;
}

export default function ContentSection({
    contentRef,
    contentOpacity,
    scrollProgress,
    showContent,
    showLook,
}: ContentSectionProps) {
    const { t } = useTranslation();
    const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

    return (
        <section
            ref={contentRef as RefObject<HTMLElement>}
            className="relative min-h-screen bg-white z-20"
            style={{
                opacity: contentOpacity,
                transition: "opacity 0.5s ease",
            }}
        >
            <div className="px-4 py-12 md:px-6 md:py-24 lg:px-12">
                {/* LOOK BEYOND LIMITS Layout */}
                <div className="relative ">
                    {/* LOOK + BEYOND LIMITS wrapper */}
                    <div className="overflow-visible">
                        {/* Inline-block so its width matches the "LOOK" text exactly */}
                        <div
                            className="inline-block relative"
                            style={{
                                marginLeft: "clamp(16px, 8vw, 120px)",
                            }}
                        >
                            <h2
                                className="font-light uppercase leading-none tracking-wide"
                                style={{
                                    fontSize: "clamp(40px, 13vw, 200px)",
                                    color: "#d4c4b0",
                                }}
                            >
                                {t("content.look").split("").map((char, i) => (
                                    <span
                                        key={i}
                                        className="inline-block !font-[300] text-[#EAE6E0]"
                                        style={{
                                            fontFamily: "var(--font-montserrat), sans-serif",
                                            opacity: showLook ? 1 : 0,
                                            transform: showLook ? "translateY(0)" : "translateY(80px)",
                                            transition: "opacity 0.8s ease, transform 0.8s ease",
                                            transitionDelay: `${i * 400}ms`,
                                        }}
                                    >
                                        {char}
                                    </span>
                                ))}
                            </h2>

                            {/* BEYOND LIMITS — pinned to bottom-right of LOOK */}
                            <div
                                className="absolute -right-4 overflow-hidden"
                                style={{
                                    bottom: "0.8em",
                                    opacity: showLook ? 1 : 0,
                                    transform: showLook ? "translateY(0)" : "translateY(40px)",
                                    transition:
                                        "opacity 1.2s ease 0.4s, transform 1.2s ease 0.4s",
                                }}
                            >
                                <p
                                    className="font-light uppercase tracking-[0.15em] whitespace-nowrap"
                                    style={{
                                        fontSize: "clamp(1rem, 2.5vw, 2rem)",
                                        color: "#8b7355",
                                    }}
                                >
                                    {t("content.beyondLimits").split(" ").map((word, i) => (
                                        <span key={i} className="inline-block !mr-4">{word}</span>
                                    ))}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Video Panel Position Placeholder */}
                    <div
                        className="absolute top-10 right-4 md:right-20 w-[60vw] md:w-[36vw] h-[20vh] md:h-[30vh] pointer-events-none"
                        aria-hidden="true"
                    >
                        <img src="./images/horizontal.jpg" />
                    </div>
                </div>

                {/* Horizontal Image Strip */}
                <div
                    className="mt-8 md:mt-16 h-[15vh] md:h-[20vh] !ml-4 md:!ml-10 w-full overflow-hidden flex"
                    style={{
                        opacity: showLook ? 1 : 0,
                        transform: showLook ? "translateY(0)" : "translateY(60px)",
                        transition: "opacity 1s ease 0.6s, transform 1s ease 0.6s",
                    }}
                >
                    <img
                        src="./images/horizontal.jpg"
                        alt="Amalfi Coast panorama"
                        className="h-full w-full md:w-[80%] object-cover"
                        style={{
                            transform: `translateX(${scrollProgress * -5}vw)`,
                            transition: "transform 0.3s ease",
                        }}
                    />
                    {/* FIND */}
                    <div
                        className="h-full flex items-end pr-[5] overflow-hidden"
                        style={{
                            opacity: showLook ? 1 : 0,
                            transform: showLook ? "translateY(0)" : "translateY(40px)",
                            transition: "opacity 1s ease 0.8s, transform 1s ease 0.8s",
                        }}
                    >
                        <span
                            className="font-light uppercase tracking-wide text-[40px] md:!text-[100px]"
                            style={{
                                color: "#d4c4b0",
                            }}
                        >
                            {t("content.find").split(" ").map((word, i) => (
                                <span key={i} className={`inline-block ${i > 0 ? "pl-2" : ""}`}>{word}</span>
                            ))}
                        </span>
                    </div>
                </div>

                {/* TRUE PERFECTION */}
                <div
                    className="mt-4 text-center overflow-hidden"
                    style={{
                        opacity: showLook ? 1 : 0,
                        transform: showLook ? "translateY(0)" : "translateY(60px)",
                        transition: "opacity 1s ease 1s, transform 1s ease 1s",
                    }}
                >
                    <h2
                        className="font-light uppercase tracking-[0.005em]"
                        style={{
                            fontSize: "clamp(2rem, 8vw, 7rem)",
                            color: "#8b7355",
                        }}
                    >
                        {t("content.truePerfection").split(" ").map((word, i) => (
                            <span key={i} className={`inline-block ${i > 0 ? "!pl-[3vw]" : ""}`}>{word}</span>
                        ))}
                    </h2>
                </div>

                {/* Side Mail Icon — hidden on mobile */}
                <NewsletterModal
                    isOpen={isNewsletterOpen}
                    onOpenChange={setIsNewsletterOpen}
                >
                    <div
                        className="fixed left-6 bottom-20 -translate-y-1/2 z-30 hidden md:block cursor-pointer"
                        style={{
                            opacity: showContent ? 1 : 0,
                            transition: "opacity 0.5s ease",
                        }}
                    >
                        <svg
                            className="h-6 w-6 text-stone-400 hover:text-stone-600 transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                </NewsletterModal>


            </div>
        </section>
    );
}
