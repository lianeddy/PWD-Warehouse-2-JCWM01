const express = require('express') //import express
const router = express.Router()
const { productsController } = require('../controller') //hubungin dengan Controller

router.get('/get-products',productsController.getProducts)
router.get('/get-products-size',productsController.getProductsSize)
router.get('/get-products-category',productsController.getProductsCategory)
router.get('/get-products-color',productsController.getProductsColor)
router.get('/get-products-max-page',productsController.getMaxPage)
router.get('/get-products-detail',productsController.getProductsDetail)

module.exports = router
