const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('hi');
});

router.patch('/', (req, res) => {
    res.status(200).send('hi');
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.status(200).send(`hi ${id}`);
});

module.exports = router;