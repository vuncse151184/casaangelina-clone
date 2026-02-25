'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Pre-warm the weather cache on startup
    const weatherService = strapi.service('api::weather.weather');

    try {
      await weatherService.fetchAndCache();
      strapi.log.info('Weather cache pre-warmed on startup');
    } catch (error) {
      strapi.log.error('Failed to pre-warm weather cache:', error.message);
    }

    // Refresh weather data every 2 hours (7,200,000 ms)
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    setInterval(async () => {
      try {
        await weatherService.fetchAndCache();
        strapi.log.info('Weather cache refreshed (2h interval)');
      } catch (error) {
        strapi.log.error('Weather cache refresh failed:', error.message);
      }
    }, TWO_HOURS);
  },
};
