var net = require("net");

var socket = net.connect(5001, "localhost");
socket.setEncoding("utf8");
socket.on("data", data => {
  console.log(data);
  socket.destroy();
});

socket.write('{"command":"CheckSensors"}');
