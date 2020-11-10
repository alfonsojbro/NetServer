const createHTTPResponse = (statusCode, contentType, body) => {
  const server = "\n";

  const contentType = `Content-Type: ${contentType}\n`;
  var today = new Date();

  const date = `Date: ${today.getDate()}\n`;
  const connection = "Connection: \n";

  const responseBody = `<!DOCTYPE>\n<html>\n<head>\n<title>${statusCode} ${body}</title>\n</head>\n<body>\n<h1> ${body}</h1>\n</body>\n</html>`;
  const contentLength = `Content-Length: ${responseBody.length()} \n`;
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
