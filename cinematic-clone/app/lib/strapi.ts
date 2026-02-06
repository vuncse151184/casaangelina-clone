import type {
    Resort,
    Room,
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
