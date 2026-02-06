"use client";

export default function EthosSection() {
    const services = [
        { name: "Wellbeing", href: "/services/wellbeing" },
        { name: "Pool", href: "/services/pool" },
        { name: "Beach", href: "/services/beach" },
        { name: "The Grounds", href: "/services/grounds" },
        { name: "Our Boats", href: "/services/boats" },
        { name: "Concierge", href: "/services/concierge" },
    ];

    return (
        <section className="relative min-h-screen bg-white py-24 px-6 lg:px-16">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left Column - Ethos */}
                    <div>
                        <h2
                            className="text-[#d4c4b0] font-light uppercase tracking-[0.5em] mb-8"
                            style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
                        >
                            e t h o s
                        </h2>
                        <p className="text-[#8b7355] leading-relaxed text-lg mb-8">
                            Understated chic is our design ethos and subtle details are our
                            raison d&apos;être. We ensure everything about your stay is immaculate,
                            from the pillowy white cotton sheets dressing your bed to the
                            thoughtfully-placed garden-grown herb garnishes on your plate.
                        </p>
                        <p className="text-[#a89680] leading-relaxed">
                            Clean lines and lashings of white underscore the rich tones of
                            nature&apos;s palette. An airy refuge, our boutique hotel is a place
                            where guests can rediscover the forgotten rhythms of long,
                            drawn-out days and easy, lingering evenings.
                        </p>

                        {/* Services Grid */}
                        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {services.map((service) => (
                                <a
                                    key={service.name}
                                    href={service.href}
                                    className="group relative overflow-hidden rounded-sm border border-[#e8e0d8] p-4 transition-all hover:border-[#8b7355] hover:shadow-lg"
                                >
                                    <span className="text-sm uppercase tracking-[0.15em] text-[#8b7355] group-hover:text-[#6b5340] transition-colors">
                                        {service.name}
                                    </span>
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#d4c4b0] transition-all group-hover:w-full" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div className="relative">
                        <div className="aspect-[3/4] overflow-hidden">
                            <img
                                src="/images/ethos-room.jpg"
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
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#d4c4b0] to-transparent" />
            </div>
        </section>
    );
}
