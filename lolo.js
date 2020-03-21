const Influx = require('influx');
const influx = new Influx.InfluxDB({
 host: 'localhost',
 port: '8086',
 database: 'mydb_mimi',
//  schema: [
//    {
//      measurement: 'response_times',
//      fields: {
//        path: Influx.FieldType.STRING,
//        duration: Influx.FieldType.INTEGER
//      },
//      tags: [
//        'host'
//      ]
//    }
//  ]
})

influx.writePoints([
  {
    measurement: 'response_times',
    tags: { host: 'lolo' },
    fields: { duration: 1223, path: 'string' },
  }
]).then(() => {
  return influx.query(`
    select * from "mydb".."response_times"
    where host = lolo
    order by time desc
    limit 10
  `)
}).then(rows => {
  rows.forEach(row => console.log(`A request returned a row!`))
})