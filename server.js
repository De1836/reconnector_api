const http = require('http');
const app = require('./app');

const port = process.env.PORT || 1836;

const server = http.createServer(app);

server.listen(port);