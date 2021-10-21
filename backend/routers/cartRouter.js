const express = require('express') //import express
const router = express.Router()
const { cartController } = require('../controller') //hubungin dengan Controller

router.get('/id',cartController.getCartID)
router.put('/add',cartController.addCartItems)

module.exports = router