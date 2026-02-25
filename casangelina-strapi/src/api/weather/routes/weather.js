'use strict';

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/weather',
            handler: 'weather.getWeather',
            config: {
                auth: false,
            },
        },
    ],
};
