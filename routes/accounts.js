const express = require('express');
const router = express.Router();

const accountsController = require('../controllers/accounts');

router.post('/signup', accountsController.signup);
router.post('/signin', accountsController.signin);

module.exports = router;
