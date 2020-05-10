# ubibot

Developed on node 12.16 and npm 6.14.

## Supporting infrastructure

Before running the app run `docker-compose up -d` to start influxDB, chronograf, and grafana. Create a new influxDB table if this is a new deployment.

## Run in development

1. Create an app.properties file with an api.read.key property (found in Ubibot Console)
and an openweathermap.api.key property.

2. `npm install`

3. `node app.js`

## Deploy in docker

1. `docker build -t app:tag .`

2. `docker run --net="host" app:tag`