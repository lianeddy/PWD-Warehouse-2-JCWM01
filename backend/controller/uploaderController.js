const {db} = require('../database') //akses file (baca/tulis)
const { uploader } = require('../helper/uploader')
const fs = require('fs')

module.exports = {
    addProduct: (req, res) => {
        try { //ini promise kayak then
            let path = '/images'
            const upload = uploader(path, 'IMG').fields([{ name: 'file' }])

            upload(req, res, (err) => {
                if (err) {
                    console.log(err)
                    res.status(500).send(err)
                }

                const { file } = req.files
                const filepath = file ? path + '/' + file[0].filename : null

                //json parse
                let data = JSON.parse(req.body.data)
                data.image = filepath

                //simpan datanya ke database, image = lokasi+nama image ini untuk product table
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
                })

                //ini untuk ke table warehouse_stock
                //ambil dulu product_id nya
                let scriptQuery = `select product_id from fp_pwd_5.products where product_name = ${db.escape(data.product_name)};`
                let sizeArray = data.size.split(",") 

                let product_id = ""

                db.query(scriptQuery, (err, result)=> {
                    if (err) {
                        return res.status(500).send(err)
                    } else {
                        product_id = result[0].product_id
        
                        // baru update value table warehouse_stock
                        let sizeQuery = ""
                        
                        sizeArray.map((val,key)=>{
                            if(key!==sizeArray.length-1){
                                return sizeQuery = sizeQuery + `(null,${db.escape(data.warehouse_id)},${db.escape(product_id)},${db.escape(val)},0,0),`
                            }
                            else if(key===sizeArray.length-1){
                                return sizeQuery = sizeQuery + `(null,${db.escape(data.warehouse_id)},${db.escape(product_id)},${db.escape(val)},0,0);`
                            }
                        })

                        let sqlInsertStock = `Insert into fp_pwd_5.warehouse_stock values ${sizeQuery}`

                        db.query(sqlInsertStock, (err, results) => {
                            if (err) {
                                console.log(err)
                                fs.unlinkSync('./public' + filepath) //ini kalo error pas simpen img (network/apapun pokonya gagal), the entire file bakal dihapus
                                res.status(500).send(err)
                            }
                            res.status(200).send({ message: "Product added successfully. Please edit product stock in Product List menu if necessary." })
                        })
                    }

                })


            })
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    editImage: (req, res) => {
        try { //ini promise kayak then
            let path = '/images'
            const upload = uploader(path, 'IMG').fields([{ name: 'file' }])

            upload(req, res, (err) => {
                if (err) {
                    console.log(err)
                    res.status(500).send(err)
                }

                const { file } = req.files
                const filepath = file ? path + '/' + file[0].filename : null

                //json parse
                let data = JSON.parse(req.body.data)
                data.image = filepath

                //simpan datanya ke database, image = lokasi+nama image ini untuk update aja
                let sqlEdit = `Update fp_pwd_5.products set 
                                product_image = ${db.escape(filepath)}
                                where product_id = ${db.escape(data.product_id)}`
                db.query(sqlEdit, (err, results) => {
                    if (err) {
                        console.log(err)
                        fs.unlinkSync('./public' + filepath) //ini kalo error pas simpen img (network/apapun pokonya gagal), the entire file bakal dihapus
                        res.status(500).send(err)
                    }
                    else{
                        res.status(200).send({ message: "Image changed." })
                    }
                })

            })
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
}