var config = require('../config/config');
var utils = require('../utils');

var utf8 = require('utf8');
var crypto = require('crypto');
var axios = require('axios');

var eventHubConfig = undefined;

/**
 * From
 */
function createSharedAccessToken(uri, saName, saKey) {
    if (!uri || !saName || !saKey) {
        throw "AZ EventHub header configuration: Missing required parameter";
    }
    var encoded = encodeURIComponent(uri);
    var now = new Date();
    var week = 60*60*24*7;
    var ttl = Math.round(now.getTime() / 1000) + week;
    var signature = encoded + '\n' + ttl;
    var signatureUTF8 = utf8.encode(signature);
    var hash = crypto.createHmac('sha256', saKey).update(signatureUTF8).digest('base64');
    return 'SharedAccessSignature sr=' + encoded + '&sig=' +
        encodeURIComponent(hash) + '&se=' + ttl + '&skn=' + saName;
}

if (config.azureEventHub.enabled.toString() === 'true') {
    eventHubConfig = {
      Authorization: createSharedAccessToken(config.azureEventHub.busNamespace, config.azureEventHub.saName, config.azureEventHub.saKey),
      ContentType: 'application/json;type=entry;charset=utf-8',
      Host: config.azureEventHub.busNamespace
    };
    utils.log('The AZ EventHub is enabled');
}

/**
 * We make direct HTTP requests to the EventHub because the node EventHub library is still in heavy development (not production ready)
 */
function insertCMXNotification(cmxNotification) {
    if (eventHubConfig) {
        axios.post(`https://${config.azureEventHub.busNamespace}/${config.azureEventHub.eventHubPath}/messages`, JSON.stringify(cmxNotification), { headers: eventHubConfig })
            .catch(function (err) {
              console.log(err);
            });
    }
};
exports.insertCMXNotification = insertCMXNotification;
