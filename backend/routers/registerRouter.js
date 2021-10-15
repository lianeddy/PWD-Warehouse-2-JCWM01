const express = require('express');
const { userController } = require('../controller')
const routers = express.Router()

routers.post('/', userController.registerUser)

module.exports = routers