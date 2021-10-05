const express = require('express') //import express
const router = express.Router()
const { productsController } = require('../controller') //hubungin dengan Controller

router.get('/get-products',productsController.getProducts)
router.get('/get-products-available',productsController.getProductsAvailable)
router.get('/get-products-size',productsController.getProductsSize)

module.exports = router
