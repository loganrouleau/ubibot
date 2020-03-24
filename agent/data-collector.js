var net = require("net");

run();

async function run() {
  let data = await getReading();
  writeToDb(data);
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

function writeToDb(data) {
  let fields = JSON.parse(data);
  let timestamp = Date.parse(fields.created_at) * 1000000;
  delete fields.created_at;
  console.log(fields);
  console.log(timestamp);
}
