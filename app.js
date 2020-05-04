const fetch = require("node-fetch");
const Influx = require("influx");
const PropertiesReader = require("properties-reader");
const properties = PropertiesReader("app.properties");
const influxDbAddress = "http://localhost:8086";
const testDb = "test";
const testMeasurement = "bot_reading3";
const influx = new Influx.InfluxDB(influxDbAddress);
const channelId = 12859;
const apiReadKey = properties.get("api.read.key");
const fieldName = {
  created_at: "timestamp",
  field1: "temp_val",
  field2: "humi_val",
  field3: "light_val",
  field4: "power_vol_val",
  field5: "rssi",
  field6: "mag_val",
};

let mostRecentWrite;
start();

async function start() {
  mostRecentWrite = await influx.query(
    'select last("temp_val"), "time" from ' + testMeasurement,
    { database: testDb }
  );
  if (mostRecentWrite.length === 0) {
    mostRecentWrite = new Date(Date.now() - 3 * 3600 * 1000);
  } else {
    mostRecentWrite = Date.parse(mostRecentWrite[0].time);
  }
  run();
  setInterval(function () {
    run();
  }, 60000);
}

async function run() {
  let data = await getReading();
  writeToDb(data);
}

async function getReading() {
  let data = await fetch(
    "https://api.ubibot.io/channels/" +
      channelId +
      "/feeds.json?" +
      new URLSearchParams({
        api_key: apiReadKey,
      })
  );
  let dataJson = await data.json();
  return dataJson;
}

async function writeToDb(data) {
  console.log("most recent write: " + new Date(mostRecentWrite));
  let rowsToWrite = data.feeds.filter((row) => {
    let createdTime = Date.parse(row.created_at);
    return createdTime > mostRecentWrite;
  });

  for (let i = 0; i < rowsToWrite.length; i++) {
    let row = rowsToWrite[i];
    let timestamp = Date.parse(row.created_at);
    if (i === 0) {
      mostRecentWrite = timestamp;
    }
    delete row.created_at;
    Object.keys(row).forEach((oldKey) => {
      row[fieldName[oldKey]] = row[oldKey];
      delete row[oldKey];
    });
    console.log(new Date(timestamp).toString() + " " + JSON.stringify(row));
    await influx.writePoints(
      [
        {
          measurement: testMeasurement,
          fields: row,
          timestamp: timestamp,
        },
      ],
      { database: testDb, precision: "ms" }
    );
  }
}
