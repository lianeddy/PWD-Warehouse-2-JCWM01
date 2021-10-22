const express = require('express') //import express
const router = express.Router()
const { warehouseController } = require('../controller') //hubungin dengan Controller

router.get('/',warehouseController.getWarehouseData)

module.exports = router