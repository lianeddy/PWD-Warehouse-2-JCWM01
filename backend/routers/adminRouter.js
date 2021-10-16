const express = require('express') //import express
const router = express.Router()
const { adminController } = require('../controller') //hubungin dengan Controller

router.get('/product-list',adminController.productList)
router.get('/product-max-page',adminController.maxPage)
router.get('/data',adminController.adminData)
router.get('/warehouse',adminController.warehouse)

module.exports = router
