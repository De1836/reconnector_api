const express = require('express');
const app = express();

const address = require('./api/routes/address');

app.use('/address', address);

module.exports = app;