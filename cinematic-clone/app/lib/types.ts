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

// ============ ETHOS (Single Type) ============

export interface EthosService {
    key: string;
    label: string;
    href: string;
}

export interface Ethos {
    id: number;
    documentId: string;
    heading: string | null;
    description1: string | null;
    description2: string | null;
    services: EthosService[] | null;
    image: StrapiMedia | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// ============ DINING VENUE ============

export interface DiningVenueData {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    tagline: string | null;
    image: StrapiMedia | null;
    href: string | null;
    order: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// ============ EXPERIENCE ============

export interface ExperienceData {
    id: number;
    documentId: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    image: StrapiMedia | null;
    href: string | null;
    order: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// ============ INSTAGRAM POST ============

export interface InstagramPostData {
    id: number;
    documentId: string;
    image: StrapiMedia | null;
    link: string | null;
    order: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// ============ BLOG ============

export interface StrapiBlockChild {
    type: string;
    text?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    code?: boolean;
    url?: string;
    children?: StrapiBlockChild[];
}

export interface StrapiBlockNode {
    type: string;
    children: StrapiBlockChild[];
    level?: number;
    format?: string;
    image?: StrapiMedia;
}

export interface BlogPost {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: StrapiBlockNode[] | null;
    cover: StrapiMedia | null;
    gallery: StrapiMedia[] | null;
    blog_status: 'PUBLISHED' | 'DRAFT';
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// ============ SITE CONFIG (Single Type) ============

export interface SocialLinks {
    facebook?: string;
    instagram?: string;
    twitter?: string;
}

export interface PartnerData {
    name: string;
    src: string;
    href?: string;
}

export interface SiteConfig {
    id: number;
    documentId: string;
    footer_image: StrapiMedia | null;
    address: string | null;
    phone: string | null;
    fax: string | null;
    cin: string | null;
    copyright: string | null;
    social_links: SocialLinks | null;
    partners: PartnerData[] | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// ============ WEATHER ============

export interface WeatherData {
    location: {
        name: string;
        country: string;
        lat: number;
        lon: number;
    };
    temperature: {
        current: number;
        feelsLike: number;
        min: number;
        max: number;
        unit: string;
    };
    weather: {
        main: string;
        description: string;
        icon: string;
        iconUrl: string;
    };
    wind: {
        speed: number;
        deg: number;
        unit: string;
    };
    humidity: number;
    visibility: number;
    clouds: number;
    fetchedAt: string;
}
