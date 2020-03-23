var net = require("net");

var server = net.createServer();
server.on("connection", socket => {
  console.log("New client connected");
  socket.on("data", data => {
    console.log("Responding to command: " + data.toString());
    socket.write(
      '{"created_at":"2017-05-12T04:41:10Z","temp_val":32.132446,"humi_val":17,"light_val":767.359985,"power_vol_val":4.524133,"ssid":"m_work-GN","rssi":-37,"acce_xval":0,"acce_yval":0,"acce_zval":0,"mag_val":1,"ext_temp_val":65535}'
    );
  });
  socket.on("error", error => console.log(error));
  socket.on("close", () => console.log("Client disconnected"));
});
console.log("Mock ubibot listening on localhost:5001...");
server.listen(5001, "localhost");
