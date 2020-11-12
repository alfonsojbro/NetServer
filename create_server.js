const events = require("events");
const net = require("net");
const requestParser = require("./requestParser");
const createHTTPResponse = require("./createHTTPResponse");
const createServer = (requestHandler) => {
  const server = net.createServer((socket) => {
    let buffer = [];
    socket.on("data", (data) => {
      buffer.push(data);
      console.log("data received", data.toString());

      const request = requestParser(data);

      // send response

      const response = {
        send: (statusCode, contentType, body) => {
          const responseText = createHTTPResponse(
            statusCode,
            contentType,
            body,
            request.getHeader("Connection"),
            request.getHeader("Host")
          );
          console.log("ResponseText" + responseText);
          socket.write(responseText);
          socket.pipe(socket);

          socket.end((err) => {
            console.log(err);
          });
        },
      };

      requestHandler(request, response);
    });

    socket.on("end", () => {
      buffer.join();
      console.log("connection ended");
    });
  });
  server.on("connection", () => {
    console.log("Connection was received on the Sever of NodeJS");
  });
  server.on("close", () => {
    console.log("Bye bye, have a good one.");
  });

  return {
    listen: (portNumber) => {
      server.listen(portNumber, () => {
        console.log("Server listening to portNumber " + portNumber);
      });
    },
  };
};
module.exports = createServer;
