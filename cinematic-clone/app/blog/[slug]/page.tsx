"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getBlogBySlug, getBlogByDocumentId } from "../../lib/strapi";
import type { BlogPost, StrapiBlockNode, StrapiBlockChild, StrapiMedia } from "../../lib/types";
import { useTranslation } from "../../i18n/I18nContext";
import useScrollFadeIn from "../../hooks/useScrollFadeIn";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function getImageUrl(media: StrapiMedia | null | undefined): string | null {
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

function estimateReadingTime(blocks: StrapiBlockNode[] | null): number {
    if (!blocks) return 1;
    let wordCount = 0;
    const countWords = (children: StrapiBlockChild[]) => {
        for (const child of children) {
            if (child.text) wordCount += child.text.split(/\s+/).length;
            if (child.children) countWords(child.children);
        }
    };
    for (const block of blocks) {
        countWords(block.children);
    }
    return Math.max(1, Math.ceil(wordCount / 200));
}

// ============ BLOCK RENDERERS ============

function renderInlineChildren(children: StrapiBlockChild[]): React.ReactNode[] {
    return children.map((child, i) => {
        if (child.type === "link" && child.url) {
            return (
                <a
                    key={i}
                    href={child.url}
                    className="text-[#8b7355] underline underline-offset-4 hover:text-[#6b5340] transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {child.children ? renderInlineChildren(child.children) : child.text}
                </a>
            );
        }

        let content: React.ReactNode = child.text ?? "";

        if (child.bold) content = <strong key={`b-${i}`}>{content}</strong>;
        if (child.italic) content = <em key={`i-${i}`}>{content}</em>;
        if (child.underline) content = <u key={`u-${i}`}>{content}</u>;
        if (child.strikethrough) content = <s key={`s-${i}`}>{content}</s>;
        if (child.code)
            content = (
                <code
                    key={`c-${i}`}
                    className="bg-[#f5f0eb] px-1.5 py-0.5 rounded text-sm font-mono text-[#6b5340]"
                >
                    {content}
                </code>
            );

        return <span key={i}>{content}</span>;
    });
}

function BlockRenderer({ block }: { block: StrapiBlockNode }) {
    const children = renderInlineChildren(block.children);

    switch (block.type) {
        case "paragraph":
            return (
                <p className="text-[#5a4a3a] leading-[1.9] mb-6 text-base">
                    {children}
                </p>
            );

        case "heading": {
            const sizeMap: Record<number, string> = {
                1: "text-3xl",
                2: "text-2xl",
                3: "text-xl",
                4: "text-lg",
                5: "text-base",
                6: "text-sm",
            };
            const level = block.level || 2;
            const className = `${sizeMap[level]} font-light text-[#8b7355] uppercase tracking-[0.1em] mt-10 mb-4`;

            if (level === 1) return <h1 className={className}>{children}</h1>;
            if (level === 3) return <h3 className={className}>{children}</h3>;
            if (level === 4) return <h4 className={className}>{children}</h4>;
            if (level === 5) return <h5 className={className}>{children}</h5>;
            if (level === 6) return <h6 className={className}>{children}</h6>;
            return <h2 className={className}>{children}</h2>;
        }

        case "list": {
            const ListTag = block.format === "ordered" ? "ol" : "ul";
            return (
                <ListTag
                    className={`mb-6 pl-6 space-y-2 text-[#5a4a3a] ${block.format === "ordered"
                        ? "list-decimal"
                        : "list-disc"
                        }`}
                >
                    {block.children.map((item, i) => (
                        <li key={i} className="leading-relaxed">
                            {item.children
                                ? renderInlineChildren(item.children as StrapiBlockChild[])
                                : item.text}
                        </li>
                    ))}
                </ListTag>
            );
        }

        case "quote":
            return (
                <blockquote className="border-l-2 border-[#d4c4b0] pl-6 py-2 my-8 text-[#8b7355] italic text-lg leading-relaxed">
                    {children}
                </blockquote>
            );

        case "code":
            return (
                <pre className="bg-[#2d2a26] text-[#e8e0d8] rounded-lg p-6 my-6 overflow-x-auto font-mono text-sm leading-relaxed">
                    <code>{block.children.map((c) => c.text).join("")}</code>
                </pre>
            );

        case "image": {
            const imgUrl = getImageUrl(block.image);
            if (!imgUrl) return null;
            return (
                <figure className="my-8">
                    <img
                        src={imgUrl}
                        alt={block.image?.alternativeText || ""}
                        className="w-full rounded-sm"
                    />
                    {block.image?.caption && (
                        <figcaption className="text-center text-sm text-[#a89680] mt-3 italic">
                            {block.image.caption}
                        </figcaption>
                    )}
                </figure>
            );
        }

        default:
            return (
                <p className="text-[#5a4a3a] leading-[1.9] mb-6">{children}</p>
            );
    }
}

// ============ MAIN PAGE ============

export default function BlogDetailPage() {
    const { t } = useTranslation();
    const params = useParams();
    const slug = params?.slug as string;

    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const heroFade = useScrollFadeIn({ delay: 0, threshold: 0.05 });

    useEffect(() => {
        if (!slug) return;

        // Try by slug first, then fallback to documentId
        getBlogBySlug(slug, "*")
            .then(async (res) => {
                if (res.data.length > 0) {
                    setBlog(res.data[0]);
                } else {
                    // Fallback: try as documentId
                    const docRes = await getBlogByDocumentId(slug, "*");
                    if (docRes.data) {
                        setBlog(docRes.data);
                    } else {
                        setError("Blog post not found");
                    }
                }
            })
            .catch((e) =>
                setError(e instanceof Error ? e.message : "Failed to load")
            )
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-2 border-[#d4c4b0] border-t-[#8b7355] rounded-full animate-spin" />
                    <p className="text-[#a89680] mt-4 text-sm uppercase tracking-[0.1em]">
                        {t("blog.loading")}
                    </p>
                </div>
            </main>
        );
    }

    if (error || !blog) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[#a89680] text-lg">{error || "Not found"}</p>
                    <a
                        href="/blog"
                        className="inline-flex items-center gap-2 mt-6 text-[#8b7355] hover:text-[#6b5340] text-sm uppercase tracking-[0.15em] transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        {t("blog.backToList")}
                    </a>
                </div>
            </main>
        );
    }

    const coverUrl = getImageUrl(blog.cover);
    const readingTime = estimateReadingTime(blog.content);
    const galleryImages = blog.gallery?.filter((m) => m.url) || [];

    return (
        <main className="min-h-screen bg-white">
            {/* Back navigation */}
            <a
                href="/blog"
                className="fixed top-8 left-8 z-50 flex items-center gap-2 text-[#8b7355] hover:text-[#6b5340] transition-colors bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span className="text-sm uppercase tracking-[0.15em]">
                    {t("blog.backToList")}
                </span>
            </a>

            {/* Hero Cover Image */}
            <section className="relative h-[60vh] bg-[#f5f0eb] overflow-hidden">
                {coverUrl ? (
                    <img
                        src={coverUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#f5f0eb] via-[#ede4d8] to-[#e0d4c3]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                {/* Title overlay */}
                <div
                    ref={heroFade.ref}
                    style={heroFade.style}
                    className="absolute bottom-0 left-0 right-0 p-8 lg:p-16"
                >
                    <div className="max-w-4xl">
                        <p className="text-white/60 text-sm uppercase tracking-[0.2em] mb-3">
                            {formatDate(blog.createdAt)} &middot; {readingTime} min read
                        </p>
                        <h1
                            className="text-white font-light uppercase tracking-[0.1em] leading-tight"
                            style={{ fontSize: "clamp(1.8rem, 4vw, 3.5rem)" }}
                        >
                            {blog.title}
                        </h1>
                        {blog.excerpt && (
                            <p className="text-white/70 mt-4 text-lg max-w-2xl leading-relaxed">
                                {blog.excerpt}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 px-6 lg:px-16">
                <div
                    className="max-w-3xl mx-auto"
                >
                    {/* Decorative separator */}
                    <div className="flex items-center justify-center mb-12">
                        <div className="w-12 h-px bg-[#d4c4b0]" />
                        <div className="w-2 h-2 rounded-full bg-[#d4c4b0] mx-4" />
                        <div className="w-12 h-px bg-[#d4c4b0]" />
                    </div>

                    {/* Blocks content */}
                    {blog.content?.map((block, i) => (
                        <BlockRenderer key={i} block={block} />
                    ))}
                </div>
            </section>

            {/* Gallery */}
            {galleryImages.length > 0 && (
                <section className="py-16 px-6 lg:px-16 bg-[#faf8f5]">
                    <div
                        className="max-w-7xl mx-auto"
                    >
                        <h2 className="text-[#d4c4b0] font-light uppercase tracking-[0.3em] text-center mb-12">
                            {t("blog.gallery")}
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {galleryImages.map((img, i) => {
                                const url = getImageUrl(img);
                                if (!url) return null;
                                return (
                                    <div
                                        key={i}
                                        className="aspect-[4/3] overflow-hidden group"
                                    >
                                        <img
                                            src={url}
                                            alt={img.alternativeText || `Gallery image ${i + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Bottom navigation */}
            <section className="py-16 px-6 text-center">
                <a
                    href="/blog"
                    className="inline-flex items-center gap-3 text-[#8b7355] hover:text-[#6b5340] text-sm uppercase tracking-[0.15em] transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    {t("blog.backToList")}
                </a>
            </section>
        </main>
    );
}
