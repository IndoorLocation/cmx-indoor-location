'use strict';

module.exports = {
    port: process.env.PORT || 3004,
    key: process.env.KEY,
    floorsConfiguration: process.env.FLOORS_CONFIGURATION ? JSON.parse(process.env.FLOORS_CONFIGURATION) : undefined,
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || '6379',
        password: process.env.REDIS_AUTH,
        cmxNotificationTTL: process.env.REDIS_CMX_NOTIF_TTL || 3600,
    },
    mongodb: {
        enabled: process.env.MONGODB_ENABLED || false,
        url: process.env.MONGODB_URL || 'mongodb://localhost:27017/mapwize-cmx-logger',
        collection: process.env.MONGODB_COLLECTION || 'logs',
    },
    azureEventHub: {
        enabled: process.env.AZURE_EVENT_HUB_ENABLED || false,
        serviceBusUri: process.env.AZURE_EVENT_HUB_SERVICE_BUS_URI,
        eventHubPath: process.env.AZURE_EVENT_HUB_PATH,
        saName: process.env.AZURE_EVENT_HUB_SA_NAME,
        saKey: process.env.AZURE_EVENT_HUB_SA_KEY
    }
};
