# cmx-socket-indoor-location-emitter

Node.js server to provide indoorLocation from Cisco CMX.
Works with socketIndoorLocationProvider libraries on iOS, Android and JS.


## Installation

Node.js is required.

*   Clone the repository
*   Go to this folder, and install the modules
    ```
    npm i
    ```

## Configurator

A configurator tool is provided to create the config file necessary to run the CMX Listener.
The config file contains the necessary information to project the coordinates received from CMX onto the Mapwize map.

Here are the steps to follow:
*   Get the maps configuration from CMX by calling the API endpoint `/api/config/v1/maps` on your CMX instance. Save the output in a json file.
*   Get the images used in CMX to configure the different floors.
*   Add all the CMX images as layers in your Mapwize venue. The images should perfectly overlay the Mapwize map for high accuracy. Name each layer in Mapwize with the same name given to the corresponding floor in CMX.
*   Call the configurator providing the path to the CMX config file, your Mapwize API key, the Mapwize venueId and where to store the output. Please ensure that your Mapwize API Key has read access to your venue.

```
./configurator/configureFromMapwize.js -k [YOUR MAPWIZE API KEY] -v [MAPWIZE VENUE ID] -c [PATH TO CMX CONFIG FILE] -o [PATH TO OUTPUT]
```

## cmx-listener

NodeJS server to react on CMX notifications.
Each notification will be received and processed into an indorLocation object.

The computed indoorLocation will be saved in a redis database with the IP address as userId to be used by the emitter.

If enabled, the CMX notification can also be logged into an [Azure Cosmos DB](https://azure.microsoft.com/en-us/services/cosmos-db) instance, mapped to a MongoDB collection, and/or into an [Azure EventHub](https://azure.microsoft.com/en-us/services/event-hubs/).

Thanks to redis, we will be notified each time a key value has been changed.

To do so, redis notifications have to be enabled with the command described below.
```
redis-cli config set notify-keyspace-events K$
```

### Use

*   We first need to correctly set the configuration parameters
    *   Directly in the `config/all.js` file
    *   Via environment variables
        *   PORT: port used by the server
        *   KEY: key used to authenticate the POST query
        *   SESSIONS_REDIS_HOST: redis host
        *   SESSIONS_REDIS_PORT: redis port
        *   SESSIONS_REDIS_AUTH: redis password (if set)
        *   REDIS_CMX_NOTIF_TTL: redis key TTL
        *   MONGODB_ENABLED: enable notifications logging into MongoDB
        *   MONGODB_URL: MongoDB URL
        *   MONGODB_COLLECTION: MongoDB collection to use
*   Start the server
    ```
    npm run start-listener
    ```

### CMX Notification configuration

In your CMX dashboard, go to Manage/Notifications.
Create a notification with the following parameters:

*   type = "location update" or "movement". If you select movement, set a distance like 3 or 5 feet.
*   receiver
    *   protocol = http or https depending on your deployment
    *   host = the host where the cmxlistener is deployed
    *   port = 80 or 443 to match http or https
    *   url = "?k={KEY}" where {KEY} is your KEY environment variable

You can use [https://cmxlocationsandbox.cisco.com](), with learning/learning as credentials, to test your service.

## cmx-emitter

NodeJS server to react on socket indoor location providers.
Each socket connection will lead to a redis subscription that will help to only get the indoorLocation objects when the location of a user has been changed.
These objects will be sent to the providers via a socket channel.

### Use

*   We first need to correctly set the configuration parameters
    *   Directly in the `config/all.js` file
    *   Via environment variables
        *   PORT: port used by the server
        *   SESSIONS_REDIS_HOST: redis host
        *   SESSIONS_REDIS_PORT: redis port
        *   SESSIONS_REDIS_AUTH: redis password (if set)
*   Start the server
    ```
    npm run start-emitter
    ```

## Notes

2 branches have been created to specifically define the start script for easing the application deployments in cloud providers.
