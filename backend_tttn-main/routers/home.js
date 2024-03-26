const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const host = req.get('host');
    res.send(`Welcome to the home page! Host: ${host}`);
});

module.exports = router;
