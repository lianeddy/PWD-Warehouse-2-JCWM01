const express = require("express");
const { userController } = require("../controller");
const router = express.Router();

router.get("/getAddress", userController.getAllAddress);

module.exports = router;

//redundant