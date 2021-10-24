const express = require('express');
const { userController } = require('../controller')
const { auth } = require('../helper/authToken')
const routers = express.Router()

routers.patch('/verifying', auth, userController.verifyUser)

module.exports = routers