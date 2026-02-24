"use client";

import { useState, useEffect } from "react";
import { getBlogs } from "../lib/strapi";
import type { BlogPost } from "../lib/types";
import { useTranslation } from "../i18n/I18nContext";
import useScrollFadeIn from "../hooks/useScrollFadeIn";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function getImageUrl(media: BlogPost["cover"]): string | null {
    if (!media?.url) return null;
    return media.url.startsWith("http") ? media.url : `${STRAPI_URL}${media.url}`;
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function BlogPage() {
    const { t } = useTranslation();
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const heroFade = useScrollFadeIn({ delay: 0, threshold: 0.05 });

    useEffect(() => {
        getBlogs("cover")
            .then((res) => setBlogs(res.data))
            .catch((e) =>
                setError(e instanceof Error ? e.message : "Failed to load")
            )
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-white">
            {/* Back to Home */}
            <a
                href="/"
                className="fixed top-8 left-8 z-50 flex items-center gap-2 text-[#8b7355] hover:text-[#6b5340] transition-colors"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                </svg>
                <span className="text-sm uppercase tracking-[0.15em]">
                    {t("blog.backHome")}
                </span>
            </a>

            {/* Hero */}
            <section className="relative h-[50vh] bg-[#f5f0eb] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <div className="w-full h-full bg-gradient-to-br from-[#f5f0eb] via-[#ede4d8] to-[#e0d4c3]" />
                </div>
                <div
                    ref={heroFade.ref}
                    style={heroFade.style}
                    className="relative z-10 text-center"
                >
                    <p className="text-[#a89680] text-sm uppercase tracking-[0.3em] mb-4">
                        {t("blog.subtitle")}
                    </p>
                    <h1
                        className="text-[#8b7355] font-light uppercase tracking-[0.3em]"
                        style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
                    >
                        {t("blog.pageTitle")}
                    </h1>
                    <div className="w-16 h-px bg-[#d4c4b0] mx-auto mt-6" />
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-20 px-6 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block w-8 h-8 border-2 border-[#d4c4b0] border-t-[#8b7355] rounded-full animate-spin" />
                            <p className="text-[#a89680] mt-4 text-sm uppercase tracking-[0.1em]">
                                {t("blog.loading")}
                            </p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <p className="text-[#a89680]">{error}</p>
                            <p className="text-sm text-[#d4c4b0] mt-2">
                                {t("blog.errorHint")}
                            </p>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-[#a89680]">{t("blog.noPosts")}</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {blogs.map((blog, index) => (
                                <BlogCard key={blog.documentId} blog={blog} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

function BlogCard({ blog, index }: { blog: BlogPost; index: number }) {
    const { t } = useTranslation();
    const cardFade = useScrollFadeIn<HTMLAnchorElement>({ delay: index * 100, threshold: 0.1 });
    const coverUrl = getImageUrl(blog.cover);

    return (
        <a
            ref={cardFade.ref}
            style={cardFade.style}
            href={`/blog/${blog.slug || blog.documentId}`}
            className="group block"
        >
            {/* Cover Image */}
            <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-[#f5f0eb]">
                {coverUrl ? (
                    <img
                        src={coverUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-[#d4c4b0]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={0.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                            />
                        </svg>
                    </div>
                )}
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Date */}
            <p className="text-[#d4c4b0] text-xs uppercase tracking-[0.15em] mb-2">
                {formatDate(blog.createdAt)}
            </p>

            {/* Title */}
            <h3 className="text-[#8b7355] font-light text-xl uppercase tracking-[0.05em] mb-3 group-hover:text-[#6b5340] transition-colors leading-snug">
                {blog.title}
            </h3>

            {/* Excerpt */}
            {blog.excerpt && (
                <p className="text-[#a89680] text-sm leading-relaxed mb-4 line-clamp-3">
                    {blog.excerpt}
                </p>
            )}

            {/* Read More */}
            <div className="flex items-center gap-2 text-[#d4c4b0] text-sm uppercase tracking-[0.1em] group-hover:text-[#8b7355] transition-colors">
                <span>{t("blog.readMore")}</span>
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
    );
}
