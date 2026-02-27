'use strict';

const { Redis } = require('@upstash/redis');

const CACHE_KEY = 'weather_data';
const CACHE_TTL = 7200; // 2 hours in seconds

// Praiano, Italy (Casa Angelina location)
const LAT = 10.34599;
const LON = 107.08426;

let redis;

function getRedisClient() {
    if (!redis) {
        const url = process.env.UPSTASH_REDIS_REST_URL;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN;

        if (!url || !token) {
            throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set');
        }

        redis = new Redis({ url, token });
    }
    return redis;
}

async function fetchFromOpenWeather() {
    const apiKey = process.env.OPEN_WEATHER_API_KEY;
    if (!apiKey) {
        throw new Error('OPEN_WEATHER_API_KEY is not set in environment variables');
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${apiKey}&units=metric`;

    strapi.log.info('Fetching weather data from OpenWeatherMap...');
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`OpenWeatherMap API error: ${response.status} ${response.statusText}`);
    }

    const raw = await response.json();

    // Return a clean, curated response
    return {
        location: {
            name: raw.name,
            country: raw.sys?.country,
            lat: raw.coord?.lat,
            lon: raw.coord?.lon,
        },
        temperature: {
            current: raw.main?.temp,
            feelsLike: raw.main?.feels_like,
            min: raw.main?.temp_min,
            max: raw.main?.temp_max,
            unit: '°C',
        },
        weather: {
            main: raw.weather?.[0]?.main,
            description: raw.weather?.[0]?.description,
            icon: raw.weather?.[0]?.icon,
            iconUrl: `https://openweathermap.org/img/wn/${raw.weather?.[0]?.icon}@2x.png`,
        },
        wind: {
            speed: raw.wind?.speed,
            deg: raw.wind?.deg,
            unit: 'm/s',
        },
        humidity: raw.main?.humidity,
        visibility: raw.visibility,
        clouds: raw.clouds?.all,
        fetchedAt: new Date().toISOString(),
    };
}

module.exports = {
    /**
     * Fetch weather from OpenWeatherMap and store in Upstash Redis with TTL.
     */
    async fetchAndCache() {
        try {
            const client = getRedisClient();
            const data = await fetchFromOpenWeather();

            await client.set(CACHE_KEY, JSON.stringify(data), { ex: CACHE_TTL });

            strapi.log.info('Weather data cached in Upstash Redis (TTL: 2 hours)');
            return data;
        } catch (error) {
            strapi.log.error('Failed to fetch and cache weather:', error.message);
            return null;
        }
    },

    /**
     * Get weather data — from Upstash Redis cache if available, otherwise fetch fresh.
     */
    async getWeather() {
        try {
            const client = getRedisClient();
            const cached = await client.get(CACHE_KEY);

            if (cached) {
                strapi.log.debug('Serving weather data from Upstash Redis cache');
                // Upstash auto-deserializes JSON, but handle both cases
                return typeof cached === 'string' ? JSON.parse(cached) : cached;
            }

            strapi.log.info('Upstash Redis cache miss — fetching fresh weather data');
            return await this.fetchAndCache();
        } catch (error) {
            strapi.log.error('Error getting weather data:', error.message);
            return null;
        }
    },
};
