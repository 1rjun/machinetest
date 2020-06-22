const express = require('express');
const router = express.Router();
const verifyToken = require('../controller/authController');
const pumpController = require('../controller/pumpController')

router.post('/registerPump', pumpController.registerPump)
router.post('/listOfAllPumps', pumpController.listOfAllPumps)
router.post('/loginPump', pumpController.loginPump)


module.exports = router