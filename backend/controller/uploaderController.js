const {db} = require('../database') //akses file (baca/tulis)
const { uploader } = require('../helper/uploader')
const fs = require('fs')

module.exports = {
    addProduct: (req, res) => {
        console.log(req.data)
        try { //ini promise kayak then
            let path = '/images'
            const upload = uploader(path, 'IMG').fields([{ name: 'file' }])

            upload(req, res, (error) => {
                if (error) {
                    console.log(error)
                    res.status(500).send(error)
                }

                const { file } = req.files
                const filepath = file ? path + '/' + file[0].filename : null

                //json parse
                let data = JSON.parse(req.body.data)
                data.image = filepath

                //simpan datanya ke database, image = lokasi+nama image
                let sqlInsert = `Insert into fp_pwd_5.products values 
                                (null,${db.escape(data.product_name)},${db.escape(data.price_buy)},${db.escape(data.price_sell)},
                                ${db.escape(data.product_desc)},${db.escape(data.category)},${db.escape(data.color)},
                                ${db.escape(filepath)},1)`
                db.query(sqlInsert, (err, results) => {
                    if (err) {
                        console.log(err)
                        fs.unlinkSync('./public' + filepath) //ini kalo error pas simpen img (network/apapun pokonya gagal), the entire file bakal dihapus
                        res.status(500).send(err)
                    }
                    res.status(200).send({ message: "Product added successfully. Please edit product stock in Product List menu if necessary." })
                })
            })
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
}