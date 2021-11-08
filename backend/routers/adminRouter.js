const express = require('express') //import express
const router = express.Router()
const { adminController } = require('../controller') //hubungin dengan Controller

router.get('/product-list',adminController.productList)
router.get('/product-max-page',adminController.maxPage)
router.get('/data',adminController.adminData)
router.get('/warehouse',adminController.warehouse)
router.get('/sales',adminController.salesReport)
router.get('/transaction',adminController.getTransactionHistory)
router.get('/transaction-items',adminController.getTransactionItems)
router.get('/top-three',adminController.getTopThree)
router.get('/time-transaction',adminController.timeTransactions)
router.post('/request',adminController.stockRequest)
router.get('/get-request',adminController.getRequest)

router.patch('/edit-product',adminController.editProduct)
router.patch('/edit-stock',adminController.editStock)
router.patch('/hide-product',adminController.hideProduct)
router.patch('/show-product',adminController.showProduct)

module.exports = router
