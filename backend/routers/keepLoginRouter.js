const express = require("express");
const { userController } = require("../controller");
const router = express.Router();

router.get("/keeplogin", userController.keepLogin);

module.exports = router;
