"use client";

interface Experience {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    href: string;
}

export default function ExperiencesSection() {
    const experiences: Experience[] = [
        {
            title: "Chef on Board",
            subtitle: "Amalfi Flavors, At Sea Level",
            description:
                "An enjoyable and delicious experience, full of taste and adventure. An unusual way to enjoy authentic Neapolitan cuisine.",
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
            href: "/experiences/chef-on-board",
        },
        {
            title: "Fine Driving",
            subtitle: "A Dose of Retro Magic",
            description:
                "Few places in Italy exemplify la dolce vita quite like the Amalfi Coast. Experience it in vintage style.",
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
            href: "/experiences/fine-driving",
        },
        {
            title: "Romance Retreat",
            subtitle: "A Starry-Eyed Weekend Stay",
            description:
                "With our dreamy cliff-side setting and pared-back, sophisticated style, Casa Angelina is the ultimate romantic getaway.",
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
            href: "/experiences/romance-retreat",
        },
        {
            title: "Body & Soul",
            subtitle: "Getting Back to Your Best Self",
            description:
                "Decompress with this three-night wellness package, all about making you feel fit, healthy and stress-free.",
            image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
            href: "/experiences/body-soul",
        },
    ];

    return (
        <section className="relative min-h-screen bg-white py-24 px-6 lg:px-16 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2
                        className="text-[#d4c4b0] font-light uppercase tracking-[0.5em] mb-4"
                        style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
                    >
                        e x p e r i e n c e s
                    </h2>
                    <div className="w-16 h-px bg-[#d4c4b0] mx-auto" />
                </div>

                {/* Experiences Grid - Alternating Layout */}
                <div className="space-y-24">
                    {experiences.map((exp, index) => (
                        <div
                            key={exp.title}
                            className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                                }`}
                        >
                            {/* Image */}
                            <div
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
                                <p className="text-[#a89680] leading-relaxed mb-8 max-w-md">
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
                    ))}
                </div>
            </div>
        </section>
    );
}
