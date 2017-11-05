'use strict';

module.exports = {
    port: process.env.PORT || 3004,
    key: process.env.KEY,
    floorsConfiguration: process.env.FLOORS_CONFIGURATION ? JSON.parse(process.env.FLOORS_CONFIGURATION) : [{"hierarchyName":"CiscoCampus>Building 9>IDEAS!","dimension":{"length":74.1,"width":39,"height":15,"offsetX":0,"offsetY":0,"unit":"FEET"},"floor":1,"corners":[{"lng":3.0197530027645363,"lat":50.54409548336825},{"lng":3.0198095304884385,"lat":50.54405333279014},{"lng":3.0196268856525426,"lat":50.54402718002255},{"lng":3.019683413376444,"lat":50.54398502938338}]}],
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
