const Influx = require("influx");
const net = require("net");
const influxDbAddress = "http://localhost:8086";
const testDb = "test";
const testMeasurement = "bot_reading";
const influx = new Influx.InfluxDB(influxDbAddress);

initializeTestDb();

setInterval(function() {
  run();
}, 5000);

async function run() {
  let data = await getReading();
  await writeToDb(data);
}

function getReading() {
  return new Promise((resolve, reject) => {
    var socket = net.connect(5001, "localhost");
    socket.setEncoding("utf8");
    socket.on("data", data => {
      socket.destroy();
      resolve(data);
    });
    socket.write('{"command":"CheckSensors"}');
  });
}

async function writeToDb(data) {
  let fields = JSON.parse(data);
  let timestamp = Date.parse(fields.created_at) * 1000000;
  delete fields.created_at;
  console.log(fields);
  console.log(timestamp);
  await influx.writePoints(
    [
      {
        measurement: testMeasurement,
        fields: fields,
        //timestamp: timestamp
        timestamp: Date.now() * 1000000
      }
    ],
    { database: testDb }
  );
}

async function initializeTestDb() {
  await dropTestDb();
  await influx.createDatabase(testDb);
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
      ext_temp_val: Influx.FieldType.FLOAT
    },
    tags: []
  });
}

async function dropTestDb() {
  let names = await influx.getDatabaseNames();
  if (names.includes(testDb)) {
    await influx.dropDatabase(testDb);
  }
}
