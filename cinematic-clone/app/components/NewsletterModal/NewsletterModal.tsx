"use client";

import { useState, useCallback } from "react";
import { Popover } from "radix-ui";
import { useTranslation } from "../../i18n/I18nContext";

interface NewsletterModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export default function NewsletterModal({ isOpen, onOpenChange, children }: NewsletterModalProps) {
    const { t } = useTranslation();
    const [title, setTitle] = useState("Mr.");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            console.log("Newsletter subscription:", { title, name, surname });
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setName("");
                setSurname("");
                setTitle("Mr.");
                onOpenChange(false);
            }, 2500);
        },
        [title, name, surname, onOpenChange]
    );

    return (
        <Popover.Root open={isOpen} onOpenChange={onOpenChange}>
            <Popover.Trigger asChild>
                {children}
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    side="right"
                    sideOffset={16}
                    align="center"
                    className="z-50 w-[420px] max-h-[200px] overflow-y-scroll !bg-[#a8a297] rounded-md shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[side=right]:slide-in-from-left-2"
                    data-lenis-prevent
                >
                    <div
                        className="relative px-8 pt-2 pb-4 rounded-md"

                    >
                        {/* Close button */}
                        <Popover.Close
                            className="absolute right-5 top-5 z-10 text-white/80 hover:text-white transition-colors"
                            aria-label="Close"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </Popover.Close>

                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-2  text-center">
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#ffffff"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                <h3 className="font-['Playfair_Display',Georgia,serif] text-2xl text-white italic">
                                    Thank you!
                                </h3>
                                <p className="text-sm text-white/80 max-w-[280px] leading-relaxed">
                                    {t("newsletter.confirmMsg")}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div>
                                    {/* Title */}
                                    <h2
                                        className="text-white text-[32px] md:text-[38px] "
                                        style={{
                                            fontFamily: "var(--font-allura), cursive",
                                            fontStyle: "normal",
                                            fontWeight: 400,
                                        }}
                                    >
                                        {t("newsletter.title")}
                                    </h2>

                                    {/* Description */}
                                    <p className="text-white/90 text-[13px] leading-relaxed mb-4 max-w-[420px]">
                                        {t("newsletter.description")}
                                    </p>


                                    <h3
                                        className="text-white text-[13px] tracking-[0.2em] uppercase font-medium "
                                    >
                                        {t("newsletter.subscriptionLabel")}
                                    </h3>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                        {/* Title select + Name + Surname row */}
                                        <div className="flex items-end gap-3">
                                            {/* Title select */}
                                            <div className="relative shrink-0">
                                                <select
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    className="appearance-none bg-transparent border-b border-white/40 text-white text-[13px] py-2 pr-6 pl-1 focus:outline-none focus:border-white cursor-pointer"
                                                    style={{ minWidth: "70px" }}
                                                >
                                                    <option value="Mr." className="text-[#2a2a2a]">Mr.</option>
                                                    <option value="Mrs." className="text-[#2a2a2a]">Mrs.</option>
                                                    <option value="Ms." className="text-[#2a2a2a]">Ms.</option>
                                                </select>
                                                {/* Dropdown arrow */}
                                                <svg
                                                    className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-white/60"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <polyline points="6 9 12 15 18 9" />
                                                </svg>
                                            </div>

                                            {/* Name */}
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder={t("newsletter.name")}
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full bg-transparent border-b border-white/40 text-white text-[13px] py-2 px-1 placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                                                />
                                            </div>

                                            {/* Surname */}
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder={t("newsletter.surname")}
                                                    value={surname}
                                                    onChange={(e) => setSurname(e.target.value)}
                                                    className="w-full bg-transparent border-b border-white/40 text-white text-[13px] py-2 px-1 placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                                                />
                                            </div>
                                        </div>

                                        {/* Subscribe button */}
                                        <button
                                            type="submit"
                                            className="self-end px-8   text-[30px] text-white transition-all duration-300 rounded-sm"
                                            style={{
                                                fontFamily: "var(--font-allura), cursive",
                                                fontStyle: "normal",
                                                fontWeight: 400,
                                            }}
                                        >
                                            {t("newsletter.subscribe")}
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>

                    <Popover.Arrow className="fill-[#b8a994]" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
