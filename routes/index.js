const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.send('Welcome to g-nal_server!');
});

module.exports = router;
