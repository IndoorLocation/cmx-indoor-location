'use strict';

var config = require('./config/config');
var mapwize = require('./utils/mapwize');

// Check required environment variables
if (!config.floorsConfiguration) {
    throw 'Missing required parameter: FLOORS_CONFIGURATION';
}
if (!config.redis.host) {
    throw 'Missing required parameter: REDIS_HOST';
}
if (config.mongodb.enabled.toString() === 'true' && !config.mongodb.url) {
    throw 'Missing required parameter: MONGODB_URL';
}
if (config.azureEventHub.enabled.toString() === 'true') {
    if (!config.azureEventHub.serviceBusUri) {
        throw 'Missing required parameter: AZURE_EVENT_HUB_SERVICE_BUS_URI';
    }
    if (!config.azureEventHub.eventHubPath) {
        throw 'Missing required parameter: AZURE_EVENT_HUB_PATH';
    }
    if (!config.azureEventHub.saName) {
        throw 'Missing required parameter: AZURE_EVENT_HUB_SA_NAME';
    }
    if (!config.azureEventHub.saKey) {
        throw 'Missing required parameter: AZURE_EVENT_HUB_SA_KEY';
    }
}

mapwize.parseFloors();

require('./config/express')();
