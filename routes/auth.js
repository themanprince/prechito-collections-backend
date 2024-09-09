const express = require('express');
const router = express.Router();

const { AuthController } = require('../controllers');

router.post('/register', AuthController.create_admin);
router.post('/login', AuthController.login_admin);

module.exports = router;
