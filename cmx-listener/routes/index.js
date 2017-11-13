'use strict';

var _ = require('lodash');
var async = require('async');
var net = require('net');

var config = require('../config/config');
var mapwize = require('../utils/mapwize');
var redis = require('../utils/redis');
var mongoDB = require('../utils/mongodb');
var eventhub = require('../utils/eventhub');

/**
 * Default route
 */
exports.default = function (req, res) {
    res.status(200).send('Hello from CMX Socket Indoor Location Listener');
};

/**
 * POST route that will process the notifications sent by a CMX server
 * @param req
 * @param res
 */
exports.processCMXNotifications = function (req, res) {
    // Route key parameter used for authentication
    if (!config.key || req.query.k === config.key) {
        // We use the setImmediate method for sending directly a 200 HTTP code to the CMX server
        // (no need to wait the end of the processing)
        //async.setImmediate(function (data) {
            //_.forEach(data.notifications, function (notification) {
            _.forEach(req.body.notifications, function (notification) {
                var indoorLocation = mapwize.getIndoorLocation(notification);
                notification.indoorLocation = indoorLocation;
                eventhub.insertCMXNotification(notification);
                mongoDB.insertCMXNotification(notification);

                _.forEach(notification.ipAddress, function (ip) {
                    // Check is the IP stored in the notification is correct for redis (IPv4 or IPv6)
                    if (!_.isEmpty(indoorLocation) && (net.isIP(ip) === 4 || net.isIP(ip) === 6)) {
                        redis.setObject(ip, indoorLocation, config.redis.cmxNotificationTTL);
                    }
                });
            });
        //}, req.body);

        res.status(200).end();
    }
    else {
        res.status(403).send({ statusCode: 403, error: 'Forbidden', message: 'No key provided, access forbidden' })
    }
};
