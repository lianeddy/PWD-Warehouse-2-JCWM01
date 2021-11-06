const express = require('express') //import express
const router = express.Router()
const { transactionController } = require('../controller') //hubungin dengan Controller

router.post('/add',transactionController.addTransaction)
router.post('/cancel',transactionController.cancelTransaction)
router.post('/request',transactionController.createRequestStock)
router.get('/get',transactionController.getCurrentTransaction)
router.post('/continue',transactionController.continuePayment)
router.post('/pay',transactionController.payHandler)

module.exports = router