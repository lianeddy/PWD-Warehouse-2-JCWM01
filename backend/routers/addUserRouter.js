const express = require('express');
const { userController } = require('../controller')
const routers = express.Router()

routers.post('/add-user', userController.addUser)

module.exports = routers