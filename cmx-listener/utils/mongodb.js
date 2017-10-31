'use strict';

var config = require('../config/config');
var utils = require('../utils');

var mongo = require('mongodb').MongoClient;

var mongoDB = undefined;

/**
 * If we disable MongoDB, we don't need to create the MongoDB client because
 * the notifation won't be log
 */
if (config.mongodb.enabled.toString() === 'true') {
    mongoDB = mongo.connect(config.mongodb.url)
        .then(function (db) {
            utils.log('The MongoDB connection is UP');
            return db;
        })
        .catch(function (err) {
            utils.log(err);
        });
}

/**
 * Insert a given CMX notification into a MongoDB connection
 * @param cmxNotification The CMX notification to log
 */
function insertCMXNotification(cmxNotification) {
    if (mongoDB) {
        mongoDB.then(function (db) {
                db.collection(config.mongodb.collection).insertOne(cmxNotification)
                    .catch(function (err) {
                        utils.log(err);
                    });
        });
    }
};
exports.insertCMXNotification = insertCMXNotification;
