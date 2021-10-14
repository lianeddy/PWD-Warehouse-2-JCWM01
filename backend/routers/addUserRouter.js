const express = require('express');
const { userController } = require('../controller')
const routers = express.Router()

routers.post('/', userController.addUser)
routers.post('/', userController.getUser)

module.exports = routers