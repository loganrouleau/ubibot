const Influx = require("../agent/node_modules/influx/lib/src");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const influx = new Influx.InfluxDB("http://localhost:8086/test");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.set("port", 3000);

app.listen(app.get("port"), () => {
  console.log(`Listening on ${app.get("port")}.`);
});

app.get("/api/temperature", (request, response) => {
  influx
    .query('select * from "test".."bot_reading";')
    .then(result => response.status(200).json(result))
    .catch(error => response.status(500).json({ error }));
});
