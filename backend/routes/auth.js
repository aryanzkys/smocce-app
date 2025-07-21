const express = require('express');
const { login, checkToken } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/check-token', checkToken);

module.exports = router;
