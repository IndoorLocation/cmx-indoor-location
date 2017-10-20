'use strict';

var mapwize = require('./utils/mapwize');

mapwize.parseLayers();

require('./config/express')();
