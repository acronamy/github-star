const { config } = require('./package.json');
const { resolve } = require('path');
const { readFile } = require('fs');
const { createServer } = require('http');

// True constants
const HTTP_ERROR_CODE = 500;
const PORT = config.server.port;
const TEMPLATES_PATH = resolve(__dirname, 'public');

// Simple server
const requestHandler = (request, response) => {
  readFile(resolve(TEMPLATES_PATH, 'index.html'), (err, html) => {
    if (err) {
      response.statusCode = HTTP_ERROR_CODE;
      response.end(`Error status: ${response.statusCode} \n${err}`);
      throw new Error(err);
    }
    response.end(html);
  });

}

const server = createServer(requestHandler);
server.listen(PORT, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${PORT}`)
})