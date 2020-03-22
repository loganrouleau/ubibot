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
      temp: Influx.FieldType.FLOAT,
      humidity: Influx.FieldType.FLOAT
    },
    tags: []
  });
  await influx.writePoints(
    [
      {
        measurement: testMeasurement,
        fields: { temp: 20.0 },
        timestamp: new Date(Date.now() - 4000)
      },
      {
        measurement: testMeasurement,
        fields: { temp: 21.1 },
        timestamp: new Date(Date.now() - 3000)
      },
      {
        measurement: testMeasurement,
        fields: { temp: 21.2 },
        timestamp: new Date(Date.now() - 2000)
      },
      {
        measurement: testMeasurement,
        fields: { temp: 21.3 },
        timestamp: new Date(Date.now() - 1000)
      },
      {
        measurement: testMeasurement,
        fields: { temp: 20.3 },
        timestamp: new Date()
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
