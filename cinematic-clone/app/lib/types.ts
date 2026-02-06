// Strapi API Response Types

export interface StrapiMedia {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
        thumbnail?: StrapiImageFormat;
        small?: StrapiImageFormat;
        medium?: StrapiImageFormat;
        large?: StrapiImageFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
}

export interface StrapiImageFormat {
    name: string;
    hash: string;
    ext: string;
    mime: string;
    width: number;
    height: number;
    size: number;
    url: string;
}

export interface Resort {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description: string | null;
    location: string | null;
    gallery?: StrapiMedia[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface Room {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    resort_id: string;
    price: number;
    amenities: string[] | null;
    availability: boolean;
    media?: StrapiMedia[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface StrapiResponse<T> {
    data: T[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface StrapiSingleResponse<T> {
    data: T;
    meta: Record<string, unknown>;
}
