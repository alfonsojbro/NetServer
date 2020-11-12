const createHTTPResponse = (
  statusCode,
  _contentType,
  body,
  _connection,
  _server
) => {
  const server = `Server: ${_server}\n`;

  const contentType = `Content-Type: ${_contentType["Content-Type"]}\n`;
  var today = new Date().toISOString();

  const date = `Date: ${today}\n`;
  const connection = `Connection: ${_connection}\n`;

  const responseBody = `<!DOCTYPE>\n<html>\n<head>\n<title>${statusCode} ${body}</title>\n</head>\n<body>\n<h1> ${body}</h1>\n</body>\n</html>`;
  const responseBodyLength = responseBody.length;
  const contentLength = `Content-Length: ${responseBodyLength} \n`;
  const responseText =
    "HTTP 1.1 " +
    statusCode +
    "\n" +
    server +
    contentType +
    date +
    connection +
    contentLength +
    "\n" +
    responseBody;

  return responseText;
};

module.exports = createHTTPResponse;
