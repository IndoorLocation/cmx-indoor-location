'use strict';

var config = require('../config/config');
var rawLayers = require('../raw-layers.json');

var _ = require('lodash');
var SphericalMercator = require('@mapbox/sphericalmercator');

var layersById = {};

/**
 * Internal method used to parse and to process the needed information of a given layer
 * @param layer Layer to parse
 */
function parseLayer(layer) {
    //Get the LatLng corners of the layer
    var latLngCorners = _.get(layer, 'importJob.corners');
    if (latLngCorners) {
        var merc = new SphericalMercator({
            size: 256
        });

        var xyCorners = _.map(latLngCorners, function (latLng) {
            var point = merc.forward([latLng.lng, latLng.lat]);
            return {x: point[0],y: point[1]};
        });

        //Get the absolute layer directions for X and Y
        var layerVectX = {
            x: (xyCorners[1].x - xyCorners[0].x),
            y: (xyCorners[1].y - xyCorners[0].y)
        };
        var layerVectY = {
            x: (xyCorners[2].x - xyCorners[0].x),
            y: (xyCorners[2].y - xyCorners[0].y)
        };

        var layerId = _.get(layer, 'data.floorId', layer._id);
        layersById[layerId] = {
            layer: layer,
            merc: merc,
            xyCorners: xyCorners,
            layerVectX: layerVectX,
            layerVectY: layerVectY
        };
    }
};

/**
 * Public method used to parse and to process all layers written inside a JSON file
 */
function parseLayers() {
    _.forEach(rawLayers, parseLayer);
};
exports.parseLayers = parseLayers;

/**
 * Process a given CMX notification and compute the corresponding indoorLocation object
 * @param cmxNotification The CMX notification to process
 */
function getIndoorLocation(cmxNotification) {
    var layer = layersById[`${cmxNotification.floorId}`];
    var indoorLocation = {};

    if (layer) {
        var relativeX = _.get(cmxNotification, 'locationCoordinate.x', 0) / _.get(layer, 'layer.data.width', 0);
        var relativeY = _.get(cmxNotification, 'locationCoordinate.y', 0) / _.get(layer, 'layer.data.height', 0);

        // Get the point in absolute coordinates
        var xyPoint = {
            x: layer.xyCorners[0].x + layer.layerVectX.x * relativeX + layer.layerVectY.x * relativeY,
            y: layer.xyCorners[0].y + layer.layerVectX.y * relativeX + layer.layerVectY.y * relativeY
        };

        // Project back into LatLng
        var lngLatPoint = layer.merc.inverse([xyPoint.x, xyPoint.y]);

        // Create the object that will be saved in redis
        indoorLocation = {
            latitude: lngLatPoint[1],
            longitude: lngLatPoint[0],
            floor: _.get(layer, 'layer.floor'),
            accuracy: 5,
            timestamp: cmxNotification.timestamp || Date.now()
        };
    }

    return indoorLocation;
};
exports.getIndoorLocation = getIndoorLocation;
