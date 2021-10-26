const express = require('express') //import express
const router = express.Router()
const { transactionController } = require('../controller') //hubungin dengan Controller

router.post('/add',transactionController.addTransaction)
router.post('/cancel',transactionController.cancelTransaction)
router.post('/request',transactionController.createRequestStock)

router.post('/continue',transactionController.continuePayment)

module.exports = router