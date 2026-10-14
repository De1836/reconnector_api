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
    "host_active": "undefined",
    "connecting_client_active": "undefined"
};

function updateResponseData(ip, port, host_active, connecting_client_active) {
    responsedata.ip = ip;
    responsedata.port = port;
    responsedata.host_active = host_active;
    responsedata.connecting_client_active = connecting_client_active;
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
    updateResponseData(IP, 1836, status === 'True', responsedata.connecting_client_active);
    res.status(200).json(responsedata);
});

// update ip and client status ("attacker")
router.patch('/client/:key/:newip/:status', (req, res) => {
    const key = req.params.key;
    const newIp = req.params.newip;
    const status = req.params.status;
    if (key !== UPLOAD_KEY) {
        return res.status(401).send('Unauthorized');
    }
    
    IP = newIp;
    
    clients.forEach(client => {
        client.write(`${IP}\n`);
    });

    updateResponseData(IP, 1836, responsedata.host_active, status === 'True');
    
    res.status(200).json(responsedata);
});

module.exports = router;