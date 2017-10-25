'use strict';

module.exports = {
    port: process.env.PORT || 3004,
    key: process.env.KEY,
    redis: {
        port: process.env.REDIS_PORT || '6379',
        host: process.env.REDIS_HOST || 'localhost',
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
        busNamespace: process.env.AZURE_EVENT_HUB_BUS_NAMESPACE,
        eventHubPath: process.env.AZURE_EVENT_HUB_PATH,
        saName: process.env.AZURE_EVENT_HUB_SA_NAME,
        saKey: process.env.AZURE_EVENT_HUB_SA_KEY
    }
    /*azureEventHub: {
        connectionString: process.env.AZURE_EVENT_HUB_CONNECTION_STRING,
        enabled: process.env.AZURE_EVENT_HUB_ENABLED || false
    }*/
};
