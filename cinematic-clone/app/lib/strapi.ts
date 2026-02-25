import type {
    Resort,
    Room,
    Ethos,
    DiningVenueData,
    ExperienceData,
    InstagramPostData,
    BlogPost,
    SiteConfig,
    WeatherData,
    StrapiResponse,
    StrapiSingleResponse
} from './types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/**
 * Fetch wrapper for Strapi API
 */
async function fetchStrapi<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = `${STRAPI_URL}/api${endpoint}`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

// ============ RESORTS ============

/**
 * Get all resorts
 */
export async function getResorts(populate = '*'): Promise<StrapiResponse<Resort>> {
    return fetchStrapi<StrapiResponse<Resort>>(`/resorts?populate=${populate}`);
}

/**
 * Get a single resort by documentId
 */
export async function getResort(
    documentId: string,
    populate = '*'
): Promise<StrapiSingleResponse<Resort>> {
    return fetchStrapi<StrapiSingleResponse<Resort>>(
        `/resorts/${documentId}?populate=${populate}`
    );
}

/**
 * Get resort by slug
 */
export async function getResortBySlug(
    slug: string,
    populate = '*'
): Promise<StrapiResponse<Resort>> {
    return fetchStrapi<StrapiResponse<Resort>>(
        `/resorts?filters[slug][$eq]=${slug}&populate=${populate}`
    );
}

// ============ ROOMS ============

/**
 * Get all rooms
 */
export async function getRooms(populate = '*'): Promise<StrapiResponse<Room>> {
    return fetchStrapi<StrapiResponse<Room>>(`/rooms?populate=${populate}`);
}

/**
 * Get a single room by documentId
 */
export async function getRoom(
    documentId: string,
    populate = '*'
): Promise<StrapiSingleResponse<Room>> {
    return fetchStrapi<StrapiSingleResponse<Room>>(
        `/rooms/${documentId}?populate=${populate}`
    );
}

/**
 * Get rooms by resort_id (Supabase UUID)
 */
export async function getRoomsByResortId(
    resortId: string,
    populate = '*'
): Promise<StrapiResponse<Room>> {
    return fetchStrapi<StrapiResponse<Room>>(
        `/rooms?filters[resort_id][$eq]=${resortId}&populate=${populate}`
    );
}

/**
 * Get room by slug
 */
export async function getRoomBySlug(
    slug: string,
    populate = '*'
): Promise<StrapiResponse<Room>> {
    return fetchStrapi<StrapiResponse<Room>>(
        `/rooms?filters[slug][$eq]=${slug}&populate=${populate}`
    );
}

// ============ ETHOS (Single Type) ============

/**
 * Get the ethos section content
 */
export async function getEthos(populate = '*'): Promise<StrapiSingleResponse<Ethos>> {
    return fetchStrapi<StrapiSingleResponse<Ethos>>(`/ethos?populate=${populate}`);
}

// ============ DINING VENUES ============

/**
 * Get all dining venues, sorted by order
 */
export async function getDiningVenues(populate = '*'): Promise<StrapiResponse<DiningVenueData>> {
    return fetchStrapi<StrapiResponse<DiningVenueData>>(
        `/dining-venues?populate=${populate}&sort=order:asc`
    );
}

// ============ EXPERIENCES ============

/**
 * Get all experiences, sorted by order
 */
export async function getExperiences(populate = '*'): Promise<StrapiResponse<ExperienceData>> {
    return fetchStrapi<StrapiResponse<ExperienceData>>(
        `/experiences?populate=${populate}&sort=order:asc`
    );
}

// ============ INSTAGRAM POSTS ============

/**
 * Get all instagram posts, sorted by order
 */
export async function getInstagramPosts(populate = '*'): Promise<StrapiResponse<InstagramPostData>> {
    return fetchStrapi<StrapiResponse<InstagramPostData>>(
        `/instagram-posts?populate=${populate}&sort=order:asc`
    );
}

// ============ BLOGS ============

/**
 * Get all published blogs, newest first
 */
export async function getBlogs(populate = '*'): Promise<StrapiResponse<BlogPost>> {
    return fetchStrapi<StrapiResponse<BlogPost>>(
        `/blogs?populate=${populate}&sort=createdAt:desc&filters[blog_status][$eq]=PUBLISHED`
    );
}

/**
 * Get a single blog by slug
 */
export async function getBlogBySlug(
    slug: string,
    populate = '*'
): Promise<StrapiResponse<BlogPost>> {
    return fetchStrapi<StrapiResponse<BlogPost>>(
        `/blogs?filters[slug][$eq]=${slug}&populate=${populate}`
    );
}

/**
 * Get a single blog by documentId
 */
export async function getBlogByDocumentId(
    documentId: string,
    populate = '*'
): Promise<StrapiSingleResponse<BlogPost>> {
    return fetchStrapi<StrapiSingleResponse<BlogPost>>(
        `/blogs/${documentId}?populate=${populate}`
    );
}

// ============ SITE CONFIG (Single Type) ============

/**
 * Get the global site configuration
 */
export async function getSiteConfig(populate = '*'): Promise<StrapiSingleResponse<SiteConfig>> {
    return fetchStrapi<StrapiSingleResponse<SiteConfig>>(`/site-config?populate=${populate}`);
}

// ============ WEATHER ============

/**
 * Get cached weather data (refreshed every 2 hours on the server)
 */
export async function getWeather(): Promise<{ data: WeatherData }> {
    return fetchStrapi<{ data: WeatherData }>('/weather');
}
