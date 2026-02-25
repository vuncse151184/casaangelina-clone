'use strict';

module.exports = {
    async getWeather(ctx) {
        try {
            const data = await strapi
                .service('api::weather.weather')
                .getWeather();

            if (!data) {
                ctx.status = 503;
                ctx.body = {
                    error: 'Weather data is not available yet. Please try again shortly.',
                };
                return;
            }

            ctx.body = { data };
        } catch (error) {
            strapi.log.error('Weather controller error:', error);
            ctx.status = 500;
            ctx.body = { error: 'Failed to retrieve weather data.' };
        }
    },
};
