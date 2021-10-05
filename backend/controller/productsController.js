const {db} = require('../database') //akses file (baca/tulis)

module.exports = {
    getProducts: (request,response) => {
        let scriptQuery = 'select * from fp_pwd_5.products'
        if(request.query.product_id){
            scriptQuery = `select * from fp_pwd_5.products where product_id = ${db.escape(request.query.product_id)}` //query ambil data ini bikin otomatis nentuin tipe datanya apa
        }

        if(request.query.product_name){
            scriptQuery = `select * from fp_pwd_5.products where product_id = ${db.escape(request.query.product_name)}` //query ambil data ini bikin otomatis nentuin tipe datanya apa
        }
    
        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },
    getProductsAvailable: (request,response) => {
        let scriptQuery = `select * from fp_pwd_5.products p 
        join (select product_id, size, sum(user_stock) as available_stock from fp_pwd_5.warehouse_stock group by product_id) ws
        on p.product_id = ws.product_id;`
        if(request.query.product_id){
            scriptQuery = `select * from fp_pwd_5.products p 
            join (select product_id, size, sum(user_stock) as available_stock from fp_pwd_5.warehouse_stock group by product_id) ws
            on p.product_id = ws.product_id 
            where p.product_id = ${db.escape(request.query.product_id)}` //query ambil data ini bikin otomatis nentuin tipe datanya apa
        }

        if(request.query.product_name){
            scriptQuery = `select * from fp_pwd_5.products p 
            join (select product_id, size, sum(user_stock) as available_stock from fp_pwd_5.warehouse_stock group by product_id) ws
            on p.product_id = ws.product_id 
            where p.product_id = ${db.escape(request.query.product_name)}` //query ambil data ini bikin otomatis nentuin tipe datanya apa
        }
    
        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },
    getProductsSize: (request,response) => {
        let scriptQuery = `select * from fp_pwd_5.products p 
        join (select product_id, size, sum(user_stock) as available_stock from fp_pwd_5.warehouse_stock group by product_id, size) ws
        on p.product_id = ws.product_id;`
        if(request.query.product_id){
            scriptQuery = `select * from fp_pwd_5.products p 
            join (select product_id, size, sum(user_stock) as available_stock from fp_pwd_5.warehouse_stock group by product_id, size) ws
            on p.product_id = ws.product_id 
            where p.product_id = ${db.escape(request.query.product_id)}` //query ambil data ini bikin otomatis nentuin tipe datanya apa
        }

        if(request.query.product_name){
            scriptQuery = `select * from fp_pwd_5.products p 
            join (select product_id, size, sum(user_stock) as available_stock from fp_pwd_5.warehouse_stock group by product_id, size) ws
            on p.product_id = ws.product_id 
            where p.product_id = ${db.escape(request.query.product_name)}` //query ambil data ini bikin otomatis nentuin tipe datanya apa
        }
    
        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },
    getProductsType: (request,response) => {
        let scriptQuery = `select * from fp_pwd_5.products p 
        join (select product_id, size, sum(user_stock) as available_stock from fp_pwd_5.warehouse_stock group by type) ws
        on p.product_id = ws.product_id;`
        if(request.query.product_id){
            scriptQuery = `select * from fp_pwd_5.products p 
            join (select product_id, size, sum(user_stock) as available_stock from fp_pwd_5.warehouse_stock group by type) ws
            on p.product_id = ws.product_id 
            where p.product_id = ${db.escape(request.query.product_id)}` //query ambil data ini bikin otomatis nentuin tipe datanya apa
        }

        if(request.query.product_name){
            scriptQuery = `select * from fp_pwd_5.products p 
            join (select product_id, size, sum(user_stock) as available_stock from fp_pwd_5.warehouse_stock group by type) ws
            on p.product_id = ws.product_id 
            where p.product_id = ${db.escape(request.query.product_name)}` //query ambil data ini bikin otomatis nentuin tipe datanya apa
        }
    
        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },

}