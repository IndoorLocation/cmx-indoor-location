#!/usr/bin/env bash

if [ "${MODE}" == "emitter" ]; then
    npm run start-emitter
else
    npm run start-listener
fi