const http = require('http');

const port = process.env.PORT || 1836;

const server = http.createServer();

server.listen(port);