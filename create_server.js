const events = require("events");
const net = require("net");

const codeToReason = (code) => {
  const reasons = {
    200: "Ok",
    404: "Not Found",
    500: "Internal Server Error",
  };
  return reasons[code];
};

const requestParser = (data) => {
  const [requestHeader, ...bodyContent] = data.toString().split("\r\n\r\n");

  const [firstLine, ...otherLines] = requestHeader.split("\n");
  const [method, path, httpVersion] = firstLine.trim().split(" ");
  const headers = Object.fromEntries(
    otherLines

      .map((line) => line.split(":").map((part) => part.trim()))
      .map(([name, ...rest]) => [name, rest.join(" ")])
  );

  var body = bodyContent[0];

  const getHeader = (header) => {
    Object.keys(headers).map((_header) => {
      const lowercaseHeader = _header.toString().toLowerCase();
      if (lowercaseHeader === header.toLowerCase()) return headers[header];
    });
    return headers[header];
  };

  const request = {
    method,
    path,
    httpVersion,
    headers,
    body,
    getHeader,
  };

  return request;
};

const createServer = (requestHandler) => {
  const server = net.createServer((socket) => {
    // send response

    let buffer = [];

    socket
      .on("data", (data) => {
        /*  if (!dataVerificator.hasAllHeaders(data)) {
          return;
        }

        // content-length ?

        if (!isThereBody) {
          // send response
          return;
        }

        // ...

        if (!hasBody) {
          return;
        }*/

        const request = requestParser(data);

        const response = {
          send: (statusCode, headers, body) => {
            let responseHeaders = headers;
            var today = new Date().toISOString();

            responseHeaders = { ...responseHeaders, Date: `${today}` };

            const responseBodyLength = body.length;
            responseHeaders = {
              ...responseHeaders,
              "Content-Length": responseBodyLength,
            };

            const reason = codeToReason(statusCode);
            socket.write(`HTTP/1.1 ${statusCode} ${reason}\r\n`);

            Object.keys(responseHeaders).map((key) => {
              socket.write(`${key}: ${responseHeaders[key]}\r\n`);
            });
            socket.write("\r\n");

            socket.write(body + "\r\n");
            socket.end();
          },
        };
        requestHandler(request, response);
      })
      .on("end", () => {
        buffer = buffer.concat(buffer).join();
      })
      .on("error", (err) => {
        // This prints the error message and stack trace to `stderr`.
        console.error(err.stack);
      });
  });

  return {
    listen: (portNumber) => {
      server.listen(portNumber, () => {
        console.log("Server listening to portNumber " + portNumber);
      });
    },
    close: () => {
      server.close();
    },
  };
};

module.exports = createServer;
