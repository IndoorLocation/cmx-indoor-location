var config = require('../config/config');
var utils = require('../utils');

var utf8 = require('utf8');
var crypto = require('crypto');
var HttpsAgent = require('agentkeepalive').HttpsAgent;
var https = require('https');

var keepaliveAgent = new HttpsAgent({
    maxSockets: 160,
    maxFreeSockets: 10,
    timeout: 6000,
    freeSocketKeepAliveTimeout: 30000, // free socket keepalive for 30 seconds
});

var eventHubAuth = undefined;

function createSharedAccessToken(uri, saName, saKey) {
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
    eventHubAuth = createSharedAccessToken(config.azureEventHub.serviceBusUri, config.azureEventHub.saName, config.azureEventHub.saKey);
    utils.log('The AZ EventHub is enabled');
}

/**
 * We make direct HTTP requests to the EventHub because the node EventHub library is still in heavy development (not production ready)
 */
function insertCMXNotification(cmxNotification) {
    if (eventHubAuth) {
        var content = JSON.stringify(cmxNotification);
        var contentLength = content.length;

        var options = {
            host: `${config.azureEventHub.serviceBusUri}`,
            path: `/${config.azureEventHub.eventHubPath}/messages`,
            port: 443,
            method: 'POST',
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': eventHubAuth,
                'Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            agent: keepaliveAgent
        };

        var request = https.request(options, function (res) {
            res.on('data', function() {});
        });

        request.on('error', function (err) {
            console.error(err);
        });

        request.write(content);
        request.end();
    }
};
exports.insertCMXNotification = insertCMXNotification;
