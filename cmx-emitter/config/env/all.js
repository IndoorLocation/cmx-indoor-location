'use strict';

module.exports = {
    port: process.env.PORT || 3003,
    redis: {
        port: process.env.REDIS_PORT || '6379',
        host: process.env.REDIS_HOST || 'localhost',
        password: process.env.REDIS_AUTH
    }
};
