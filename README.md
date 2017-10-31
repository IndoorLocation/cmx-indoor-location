# cmx-socket-indoor-location-emitter
Node.js server to provide IndoorLocation from Cisco CMX. Works with socketIndoorLocationProviders libraries on iOS, Android and JS.


## Configurator

A configurator tool is provided to create the config file necessary to run the CMX Listener. 
The config file contains the necessary information to project the coordinates received from CMX onto the Mapwize map.

Here are the steps to follow:

- Get the maps configuration from CMX by calling the API endpoint `/api/config/v1/maps` on your CMX instance. Save the output in a json file.
- Get the images used in CMX to configure the different floors.
- Add all the CMX images as layers in your Mapwize venue. The images should perfectly overlay the Mapwize map for high accuracy. Name each layer in Mapwize with the same name given to the corresponding floor in CMX.
- Call the configurator providing the path to the CMX config file, your Mapwize API key, the Mapwize venueId and where to store the output. Please ensure that your Mapwize API Key has read access to your venue.

`./configurator/configureFromMapwize.js -k [YOUR MAPWIZE API KEY] -v [MAPWIZE VENUE ID] -c [PATH TO CMX CONFIG FILE] -o [PATH TO OUTPUT]`
