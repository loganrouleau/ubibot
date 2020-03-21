const Influx = require('influx');
// const influx = new Influx.InfluxDB('http://localhost:8086')
// influx.createDatabase('express_response_db')
const influx = new Influx.InfluxDB({
 host: 'localhost',
 port: '8086',
 database: 'express_response_db',
 schema: [
   {
     measurement: 'response_times',
     fields: {
       path: Influx.FieldType.STRING,
       duration: Influx.FieldType.INTEGER
     },
     tags: [
       'host'
     ]
   }
 ]
})
influx.createDatabase('express_response_db')