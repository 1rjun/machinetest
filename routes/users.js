const express = require("express");
const router = express.Router();
const verifyToken = require("../controller/authController");
// const pumpController = require('../controller/pumpController')
const userController = require("../controller/userController");
const bookingController = require("../controller/bookingController");

router.post("/registerUser", userController.registerUser);
router.post("/loginUser", userController.loginUser);
router.post("/listOfAllUsers", userController.listOfAllUsers);

//image upload route
router.post("/upload", userController.uploadImage);

//booking Controller
router.post("/booking", verifyToken, bookingController.booking);
router.post("/listMyBooking", verifyToken, bookingController.listMyBooking);

module.exports = router;