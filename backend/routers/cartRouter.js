const express = require('express') //import express
const router = express.Router()
const { cartController } = require('../controller') //hubungin dengan Controller

router.get('/id',cartController.getCartID)
router.post('/add',cartController.addCartItems)
router.get('/get',cartController.getCartItems)
router.post('/delete',cartController.deleteCartItems)

module.exports = router