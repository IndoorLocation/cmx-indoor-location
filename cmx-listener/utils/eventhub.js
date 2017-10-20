var config = require('../config/config');
var utils = require('../utils');

var EventHubClient = require('azure-event-hubs').Client;

var eventHub = undefined;

if (config.azureEventHub.enabled.toString() === 'true') {
    var client = EventHubClient.fromConnectionString(config.azureEventHub.connectionString);
    eventHub = client.open().then(function () {
        utils.log('The AZ EventHub connection is UP');
        return client.createSender();
    });
}

/**
 * Insert a given CMX notification into an Azure EventHub
 * @param cmxNotification The CMX notification to log
 */
function insertCMXNotification(cmxNotification) {
    if (eventHub) {
        eventHub.then(function (tx) {
            tx.once('errorReceived', function (err) { utils.log(err); });
            tx.send(cmxNotification, cmxNotification.deviceId);
        });
    }
};
exports.insertCMXNotification = insertCMXNotification;
