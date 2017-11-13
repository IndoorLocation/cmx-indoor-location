'use strict';

var config = require('../config/config');

var _ = require('lodash');
var SphericalMercator = require('@mapbox/sphericalmercator');

var floorConfigurationsByHierarchyName = {};

/**
 * Internal method used to parse and to process the needed information of a given floor
 * @param  floor to parse
 */
function ParseFloor(floor) {
    //Get the LatLng corners of the floor
    var latLngCorners = _.get(floor, 'corners');
    if (latLngCorners) {
        var merc = new SphericalMercator({
            size: 256
        });

        var xyCorners = _.map(latLngCorners, function (latLng) {
            var point = merc.forward([latLng.lng, latLng.lat]);
            return {x: point[0],y: point[1]};
        });

        //Get the absolute floor directions for X and Y
        var floorVectX = {
            x: (xyCorners[1].x - xyCorners[0].x),
            y: (xyCorners[1].y - xyCorners[0].y)
        };
        var floorVectY = {
            x: (xyCorners[2].x - xyCorners[0].x),
            y: (xyCorners[2].y - xyCorners[0].y)
        };

        var floorHierarchyName = floor.hierarchyName;
        if (floorHierarchyName) {
            floorConfigurationsByHierarchyName[floorHierarchyName] = {
                floor: floor,
                merc: merc,
                xyCorners: xyCorners,
                floorVectX: floorVectX,
                floorVectY: floorVectY
            };
        } else {
            console.log('Floor has no HierarchyName defined. Please check your floors configuration.');
        }
    }
};

/**
 * Public method used to parse and to process all layers written inside a JSON file
 */
function parseFloors() {
    _.forEach(config.floorsConfiguration, ParseFloor);
};
exports.parseFloors = parseFloors;

/**
 * Process a given CMX notification and compute the corresponding indoorLocation object
 * @param cmxNotification The CMX notification to process
 */
function getIndoorLocation(cmxNotification) {

    //Removing the zone from the locationMapHierarchy component
    var locationMapHierarchy = cmxNotification.locationMapHierarchy || '';
    locationMapHierarchy = _.join(_.split(locationMapHierarchy, '>', 3), '>');

    var floorConfiguration = floorConfigurationsByHierarchyName[locationMapHierarchy];
    var indoorLocation = {};
    if (floorConfiguration) {
        var relativeX = _.get(cmxNotification, 'locationCoordinate.x', 0) / _.get(floorConfiguration, 'floor.dimension.width', 1);
        var relativeY = _.get(cmxNotification, 'locationCoordinate.y', 0) / _.get(floorConfiguration, 'floor.dimension.length', 1);

        // Get the point in absolute coordinates
        var xyPoint = {
            x: floorConfiguration.xyCorners[0].x + floorConfiguration.floorVectX.x * relativeX + floorConfiguration.floorVectY.x * relativeY,
            y: floorConfiguration.xyCorners[0].y + floorConfiguration.floorVectX.y * relativeX + floorConfiguration.floorVectY.y * relativeY
        };

        // Project back into LatLng
        var lngLatPoint = floorConfiguration.merc.inverse([xyPoint.x, xyPoint.y]);

        // Create the object that will be saved in redis
        indoorLocation = {
            latitude: lngLatPoint[1],
            longitude: lngLatPoint[0],
            floor: _.get(floorConfiguration, 'floor.floor'),
            accuracy: 5,
            timestamp: cmxNotification.timestamp || Date.now()
        };
    }

    return indoorLocation;
};
exports.getIndoorLocation = getIndoorLocation;
