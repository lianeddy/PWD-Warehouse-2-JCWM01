const express = require('express') //import express
const router = express.Router()
const { productsController } = require('../controller') //hubungin dengan Controller

router.get('/',productsController.getProducts)
router.get('/category',productsController.getProductsCategory)
router.get('/color',productsController.getProductsColor)
router.get('/max-page',productsController.getMaxPage)
router.get('/detail',productsController.getProductsDetail)

router.get('/admin-list',productsController.adminProductList)

module.exports = router
