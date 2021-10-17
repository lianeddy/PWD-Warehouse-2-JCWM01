const {db} = require('../database') //akses file (baca/tulis)

module.exports = {
    productList: (request,response) => {
        // console.log(request.query.product_id)
        const limit = 10;
        let scriptQuery = `select * from fp_pwd_5.products p 
        join (select warehouse_stock_id, warehouse_id, product_id, size, user_stock as available_stock from fp_pwd_5.warehouse_stock group by product_id,size,warehouse_id) ws
        on p.product_id = ws.product_id 
        where product_name like '%${request.query.product_name}%' and warehouse_id = ${request.query.warehouse_id}
        limit ${limit} offset ${request.query.page*limit};`

        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },
    editProduct: (request,response) => {
        let dataUpdate = []
        for (let prop in request.body) {
             dataUpdate.push(`${prop} = ${db.escape(request.body[prop])}`)
        }
        let dataJoined = dataUpdate.join(",")
    
        let editQuery = `update fp_pwd_5.products set ${dataJoined} where product_id = ${db.escape(request.query.product_id)};`
    
        db.query(editQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
                
            } else {
                const limit = 10;
                let scriptQuery = `select * from fp_pwd_5.products p 
                join (select warehouse_stock_id, warehouse_id, product_id, size, user_stock as available_stock from fp_pwd_5.warehouse_stock group by product_id,size,warehouse_id) ws
                on p.product_id = ws.product_id 
                where product_name like '%${request.query.product_name}%' and warehouse_id = ${request.query.warehouse_id}
                limit ${limit} offset ${request.query.page*limit};`
    
                db.query(scriptQuery, (err, result)=> {
                    if (err) {
                        return response.status(500).send(err)
                    } else {
                        return response.status(200).send(result)
                    }
                })
            }
        })
    },
    editStock: (request,response) => {
        let dataUpdate = []
        for (let prop in request.body) {
             dataUpdate.push(`${prop} = ${db.escape(request.body[prop])}`)
        }
        let dataJoined = dataUpdate.join(",")
    
        let editQuery = `update fp_pwd_5.warehouse_stock set ${dataJoined} where warehouse_stock_id = ${db.escape(request.query.warehouse_stock_id)};`
    
        db.query(editQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
                
            } else {
                const limit = 10;
                let scriptQuery = `select * from fp_pwd_5.products p 
                join (select warehouse_stock_id, warehouse_id, product_id, size, user_stock as available_stock from fp_pwd_5.warehouse_stock group by product_id,size,warehouse_id) ws
                on p.product_id = ws.product_id 
                where product_name like '%${request.query.product_name}%' and warehouse_id = ${request.query.warehouse_id}
                limit ${limit} offset ${request.query.page*limit};`
    
                db.query(scriptQuery, (err, result)=> {
                    if (err) {
                        return response.status(500).send(err)
                    } else {
                        return response.status(200).send(result)
                    }
                })
            }
        })
    },
    maxPage: (request,response) => {
        let scriptQuery = `select count(warehouse_stock_id) as sumProduct from fp_pwd_5.products p 
        join (select warehouse_stock_id, warehouse_id, product_id, size, user_stock as available_stock from fp_pwd_5.warehouse_stock group by product_id,size,warehouse_id) ws
        on p.product_id = ws.product_id 
        where product_name like '%${request.query.product_name}%' and warehouse_id = ${request.query.warehouse_id};`

        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },
    adminData: (request,response) => {
        let scriptQuery = `select * from fp_pwd_5.admin a
        join (select * from fp_pwd_5.user) u
        join (select * from fp_pwd_5.warehouse) w
        on a.user_id = u.user_id and a.warehouse_id = w.warehouse_id
        where a.user_id = ${request.query.user_id};`

        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },
    warehouse: (request,response) => {
        let scriptQuery = `select * from fp_pwd_5.warehouse group by warehouse_id;`
    
        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },
    
}