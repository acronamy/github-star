const { resolve, sep } = require('path');
const { readFile } = require('fs');
const { createServer } = require('http');
const PORT = 3030;
const TEMPLATES_PATH = resolve(__dirname, 'public');

const requestHandler = async (request, response) => {
  readFile(`${TEMPLATES_PATH}${sep}index.html`, (err, html) => {
    if(err) {
      response.status(502);
      response.end(`Something went wrong! ${err}`);
      throw new Error(err);
    }
    response.end( html );
  });
}

const server = createServer(requestHandler);
server.listen(PORT, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${PORT}`)
})