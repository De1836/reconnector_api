const express = require('express');
const router = express.Router();

require('dotenv').config(); 
const API_KEY = process.env.API_KEY;
let IP = process.env.IP;
const UPLOAD_KEY = process.env.UPLOAD_KEY;

const clients = [];

router.get('/', (req, res) => { // test 
    res.status(200).send('server active');
});

router.get('/stream/:key', (req, res) => {
    const key = req.params.key;
    if (key !== API_KEY) return res.status(401).send('Unauthorized');
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    res.write(`${IP}\n`);
    
    clients.push(res);
    
    req.on('close', () => {
        clients = clients.filter(c => c !== res);
    });
});

router.patch('/:key/:newip', (req, res) => { // update
    const key = req.params.key;
    const newIp = req.params.newip;
    if (key !== UPLOAD_KEY) {
        return res.status(401).send('Unauthorized');
    }
    
    IP = newIp;
    
    clients.forEach(client => {
        client.write(`${IP}\n`);
    });
    
    res.status(200).send(IP);
});



module.exports = router;