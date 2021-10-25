const express = require('express');
const { userController } = require('../controller')
const routers = express.Router()

routers.post('/add-user', userController.addUser)
routers.post('/get-user', userController.getUser)
routers.get('/keeplogin', userController.keepLogin)
routers.get('/address', userController.getAddress)

module.exports = routers