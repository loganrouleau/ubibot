const fetch = require("node-fetch");
const Influx = require("influx");
const PropertiesReader = require("properties-reader");
const properties = PropertiesReader("app.properties");
const influxDbAddress = "http://localhost:8086";
const testDb = "test";
const testMeasurement = "bot_reading";
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

initializeTestDb();

run();
setInterval(function () {
  run();
}, 10000);

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
  let fields = data.feeds[0];
  let timestamp = Date.parse(fields.created_at) * 1000000;
  delete fields.created_at;

  Object.keys(fields).forEach((oldKey) => {
    fields[fieldName[oldKey]] = fields[oldKey];
    delete fields[oldKey];
  });
  console.log(fields);
  await influx.writePoints(
    [
      {
        measurement: testMeasurement,
        fields: fields,
        timestamp: timestamp
      },
    ],
    { database: testDb }
  );
}

async function initializeTestDb() {
  influx.addSchema({
    database: testDb,
    measurement: testMeasurement,
    fields: {
      temp_val: Influx.FieldType.FLOAT,
      humi_val: Influx.FieldType.INTEGER,
      light_val: Influx.FieldType.FLOAT,
      power_vol_val: Influx.FieldType.FLOAT,
      ssid: Influx.FieldType.STRING,
      rssi: Influx.FieldType.FLOAT,
      acce_xval: Influx.FieldType.FLOAT,
      acce_yval: Influx.FieldType.FLOAT,
      acce_zval: Influx.FieldType.FLOAT,
      mag_val: Influx.FieldType.FLOAT,
      ext_temp_val: Influx.FieldType.FLOAT,
    },
    tags: [],
  });
}
