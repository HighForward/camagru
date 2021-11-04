#!/bin/bash

# install dependencies

yarn
yarn add global nodemon dotenv
yarn install

#exec main process (in docker-compose service)
exec "$@"
