const Influx = require("influx");
const influxDbAddress = "http://localhost:8086";
const testDb = "test";
const testMeasurement = "bot_reading";
const influx = new Influx.InfluxDB(influxDbAddress);

initializeTestDb();

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
  await influx.writePoints(
    [
      {
        measurement: testMeasurement,
        fields: {
          temp_val: 32.132446,
          humi_val: 17,
          light_val: 767.359985,
          power_vol_val: 4.524133,
          ssid: "m_work-GN",
          rssi: -37,
          acce_xval: 0,
          acce_yval: 0,
          acce_zval: 0,
          mag_val: 1,
          ext_temp_val: 65535
        },
        timestamp: Date.parse("2017-05-12T04:41:10Z") * 1000000
      }
    ],
    { database: testDb }
  );
}

async function dropTestDb() {
  let names = await influx.getDatabaseNames();
  if (names.includes(testDb)) {
    await influx.dropDatabase(testDb);
  }
}
