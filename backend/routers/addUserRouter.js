const express = require('express');
const { userController } = require('../controller')
const routers = express.Router()

routers.post('/add-user', userController.addUser)
routers.post('/get-user', userController.getUser)
routers.post('/get-user-keeplogin', userController.keeplogin)

module.exports = routers