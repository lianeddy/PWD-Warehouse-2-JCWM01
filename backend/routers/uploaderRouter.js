const express = require('express') //import express
const router = express.Router()
const { uploaderController } = require('../controller/index') //hubungin dengan productController

router.post('/add-product',uploaderController.addProduct)
router.patch('/edit-image',uploaderController.editImage)


module.exports = router
