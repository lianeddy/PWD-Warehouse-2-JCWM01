const express = require("express");
const { userController } = require("../controller");
const router = express.Router();

router.post("/add", userController.editAddress);

module.exports = router;

//redundant