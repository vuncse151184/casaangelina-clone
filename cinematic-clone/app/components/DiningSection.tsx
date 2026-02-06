"use client";

interface DiningVenue {
    name: string;
    tagline: string;
    image: string;
    href: string;
}

export default function DiningSection() {
    const venues: DiningVenue[] = [
        {
            name: "Un Piano Nel Cielo",
            tagline: "Campania-inspired cuisine paired with spectacular sea views",
            image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
            href: "/dining/un-piano-nel-cielo",
        },
        {
            name: "Seascape Restaurant",
            tagline: "Relaxed all day dining",
            image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600",
            href: "/dining/seascape",
        },
        {
            name: "Cocktail Bar",
            tagline: "Delicious cocktails & stunning views",
            image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600",
            href: "/dining/cocktail-bar",
        },
        {
            name: "Wine Cellar",
            tagline: "An award-winning wine selection",
            image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600",
            href: "/dining/wine-cellar",
        },
        {
            name: "Breakfast",
            tagline: "Mediterranean mornings start with a full-spread breakfast",
            image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600",
            href: "/dining/breakfast",
        },
        {
            name: "Rooftop Terrace",
            tagline: "Private dining & intimate celebrations",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
            href: "/dining/rooftop",
        },
    ];

    return (
        <section className="relative min-h-screen bg-[#faf8f5] py-24 px-6 lg:px-16">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2
                        className="text-[#d4c4b0] font-light uppercase tracking-[0.5em] mb-4"
                        style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
                    >
                        t a s t e
                    </h2>
                    <p className="text-[#8b7355] max-w-2xl mx-auto leading-relaxed">
                        Fine dining, Amalfi style. At Casa Angelina, the rich flavors and
                        ingredients of Campania inspire every dish.
                    </p>
                </div>

                {/* Dining Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {venues.map((venue, index) => (
                        <a
                            key={venue.name}
                            href={venue.href}
                            className="group relative overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500"
                            style={{
                                animationDelay: `${index * 100}ms`,
                            }}
                        >
                            {/* Image */}
                            <div className="aspect-[4/3] overflow-hidden">
                                <img
                                    src={venue.image}
                                    alt={venue.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-[#8b7355] font-light text-lg uppercase tracking-[0.1em] mb-2 group-hover:text-[#6b5340] transition-colors">
                                    {venue.name}
                                </h3>
                                <p className="text-[#a89680] text-sm leading-relaxed">
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
                    ))}
                </div>
            </div>
        </section>
    );
}
