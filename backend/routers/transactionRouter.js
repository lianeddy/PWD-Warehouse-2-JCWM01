const express = require('express') //import express
const router = express.Router()
const { transactionController } = require('../controller') //hubungin dengan Controller

router.post('/add',transactionController.addTransaction)
router.post('/cancel',transactionController.cancelTransaction)
router.post('/request',transactionController.createRequestStock)

module.exports = router