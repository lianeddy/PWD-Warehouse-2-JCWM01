const express = require("express");
const { userController } = require("../controller");
const router = express.Router();

router.post("/", userController.editProfile);

module.exports = router;