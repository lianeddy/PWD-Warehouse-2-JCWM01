const express = require('express') //import express
const router = express.Router()
const { uploaderController } = require('../controller/index') //hubungin dengan productController

router.post('/add-product',uploaderController.addProduct)
router.patch('/edit-image',uploaderController.editImage)
router.post('/add-profile-picture',uploaderController.addProfPic)
router.get('/getAlbum',uploaderController.getAlbum)

module.exports = router
