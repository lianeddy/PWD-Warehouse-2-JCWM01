const {db} = require('../database') //akses file (baca/tulis)

module.exports = {
    getProducts: (request,response) => {
        // console.log(request.query.page)
        const limit = 8;
        let scriptQuery = `select * from fp_pwd_5.products p 
        join (select product_id, size, sum(user_stock) as available_stock from fp_pwd_5.warehouse_stock group by product_id) ws
        on p.product_id = ws.product_id 
        limit ${limit} offset ${request.query.page*limit};`

        if(request.query.sortby){
            //name_asc, name_desc, price_asc, price_desc
            // console.log(request.query.sortby)
            switch(request.query.sortby){
                case "name_asc":
                    scriptQuery = `select * from fp_pwd_5.products p 
                    join (select product_id, size, sum(user_stock) as available_stock from fp_pwd_5.warehouse_stock group by product_id) ws
                    on p.product_id = ws.product_id 
                    order by product_name asc
                    limit ${limit} offset ${request.query.page*limit};`
                    break;
                case "name_desc":
                    scriptQuery = `select * from fp_pwd_5.products p 
                    join (select product_id, size, sum(user_stock) as available_stock from fp_pwd_5.warehouse_stock group by product_id) ws
                    on p.product_id = ws.product_id 
                    order by product_name desc
                    limit ${limit} offset ${request.query.page*limit};`
                    break;
                case "price_asc":
                    scriptQuery = `select * from fp_pwd_5.products p 
                    join (select product_id, size, sum(user_stock) as available_stock from fp_pwd_5.warehouse_stock group by product_id) ws
                    on p.product_id = ws.product_id 
                    order by price_sell asc
                    limit ${limit} offset ${request.query.page*limit};`
                    break;
                case "price_desc":
                    scriptQuery = `select * from fp_pwd_5.products p 
                    join (select product_id, size, sum(user_stock) as available_stock from fp_pwd_5.warehouse_stock group by product_id) ws
                    on p.product_id = ws.product_id 
                    order by price_sell desc
                    limit ${limit} offset ${request.query.page*limit};`
                    break;
                default:
                    scriptQuery = `select * from fp_pwd_5.products p 
                    join (select product_id, size, sum(user_stock) as available_stock from fp_pwd_5.warehouse_stock group by product_id) ws
                    on p.product_id = ws.product_id 
                    limit ${limit} offset ${request.query.page*limit};`
            }
        }

        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },
    getProductsCategory: (request,response) => {
        let scriptQuery = `select category from fp_pwd_5.products p group by category;`
        if(request.query.product_id){
            scriptQuery = `select category from fp_pwd_5.products p group by category 
            where p.product_id = ${db.escape(request.query.product_id)}` //query ambil data ini bikin otomatis nentuin tipe datanya apa
        }

        if(request.query.product_name){
            scriptQuery = `select category from fp_pwd_5.products p group by category
            where p.product_name = ${db.escape(request.query.product_name)}` //query ambil data ini bikin otomatis nentuin tipe datanya apa
        }
    
        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },
    getProductsColor: (request,response) => {
        let scriptQuery = `select color from fp_pwd_5.products p group by color;`
        if(request.query.product_id){
            scriptQuery = `select color from fp_pwd_5.products p group by color 
            where p.product_id = ${db.escape(request.query.product_id)}` //query ambil data ini bikin otomatis nentuin tipe datanya apa
        }

        if(request.query.product_name){
            scriptQuery = `select color from fp_pwd_5.products p group by color
            where p.product_name = ${db.escape(request.query.product_name)}` //query ambil data ini bikin otomatis nentuin tipe datanya apa
        }
    
        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },
    getMaxPage: (request,response) => {
        let scriptQuery = `select count(product_id) as sumProduct from fp_pwd_5.products;`
        if(request.query.category){
            scriptQuery = `select count(product_id) as sumProduct from fp_pwd_5.products
            where category = ${db.escape(request.query.category)};` //query ambil data ini bikin otomatis nentuin tipe datanya apa
        }

        if(request.query.product_color){
            scriptQuery = `select count(product_id) as sumProduct from fp_pwd_5.products
            where color = ${db.escape(request.query.color)};` //query ambil data ini bikin otomatis nentuin tipe datanya apa
        }
    
        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },
    getProductsDetail: (request,response) => {
        // console.log(request.query.product_id)
        let scriptQuery = `select * from fp_pwd_5.products p 
        join (select product_id, size, sum(user_stock) as available_stock from fp_pwd_5.warehouse_stock group by product_id, size) ws
        on p.product_id = ws.product_id 
        where p.product_id = ${request.query.product_id};`

        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },
}