const {db} = require('../database') //akses file (baca/tulis)

module.exports = {
    productList: (request,response) => {
        // console.log(request.query.product_id)
        const limit = 10;
        let scriptQuery = `select * from products p 
        join (select warehouse_stock_id, warehouse_id, product_id, size, user_stock as available_stock from warehouse_stock group by product_id,size,warehouse_id) ws
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
    
        let editQuery = `update products set ${dataJoined} where product_id = ${db.escape(request.query.product_id)};`
    
        db.query(editQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
                
            } else {
                const limit = 10;
                let scriptQuery = `select * from products p 
                join (select warehouse_stock_id, warehouse_id, product_id, size, user_stock as available_stock from warehouse_stock group by product_id,size,warehouse_id) ws
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
    
        let editQuery = `update warehouse_stock set ${dataJoined} where warehouse_stock_id = ${db.escape(request.query.warehouse_stock_id)};`
    
        db.query(editQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
                
            } else {
                const limit = 10;
                let scriptQuery = `select * from products p 
                join (select warehouse_stock_id, warehouse_id, product_id, size, user_stock as available_stock from warehouse_stock group by product_id,size,warehouse_id) ws
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
        let scriptQuery = `select count(warehouse_stock_id) as sumProduct from products p 
        join (select warehouse_stock_id, warehouse_id, product_id, size, user_stock as available_stock from warehouse_stock group by product_id,size,warehouse_id) ws
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
        let scriptQuery = `select * from admin a
        join (select * from user) u
        join (select * from warehouse) w
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
        let scriptQuery = `select * from warehouse group by warehouse_id;`
    
        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },
    hideProduct: (request,response) => {
        let sqlHide = `Update products set hide = 0 where product_id = ${db.escape(request.query.product_id)};`
    
        db.query(sqlHide, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {

                return response.status(200).send(result)
                
            }
        })
    },
    showProduct: (request,response) => {
        let sqlShow = `Update products set hide = 1 where product_id = ${db.escape(request.query.product_id)};`
    
        db.query(sqlShow, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {

                return response.status(200).send(result)
                
            }
        })
    },
    salesReport: (request,response) => {

        if(request.query.warehouse_id){
            let scriptQuery = `SELECT t.transactions_id, t.transaction_status, t.time, t.warehouse_id,
            w.warehouse_name,
            p.product_name, p.product_image, p.price_buy, ti.size, ti.quantity, ti.transaction_price,
            u.user_id, u.username
            FROM transaction_items ti join transactions t 
            join products p join user u join warehouse w
            on t.transactions_id = ti.transactions_id 
            and p.product_id = ti.product_id
            and t.user_id = u.user_id
            and t.warehouse_id = w.warehouse_id
            where t.transaction_status = "paid"
            order by time;`

            if(request.query.warehouse_id>0){
                scriptQuery = `SELECT t.transactions_id, t.transaction_status, t.time, t.warehouse_id,
                w.warehouse_name,
                p.product_name, p.product_image, p.price_buy, ti.size, ti.quantity, ti.transaction_price,
                u.user_id, u.username
                FROM transaction_items ti join transactions t 
                join products p join user u join warehouse w
                on t.transactions_id = ti.transactions_id 
                and p.product_id = ti.product_id
                and t.user_id = u.user_id
                and t.warehouse_id = w.warehouse_id
                where t.transaction_status = "paid"
                and t.warehouse_id = ${db.escape(request.query.warehouse_id)}
                order by time;`
            }

            db.query(scriptQuery, (err, result)=> {
                if (err) {
                    return response.status(500).send(err)
                } else {
                    return response.status(200).send(result)
                    
                }
            })

        }     

    },
    getTransactionHistory: (request,response) => {

        if(request.query.warehouse_id){
            let scriptQuery = `SELECT t.transactions_id, t.transaction_status, t.time, t.user_id, 
            u.username, t.warehouse_id, w.warehouse_name
            FROM transactions t join user u join warehouse w
            on t.user_id = u.user_id
            and t.warehouse_id = w.warehouse_id
            where t.warehouse_id = 1
            order by time;`

            if(request.query.warehouse_id>0){
                scriptQuery = `SELECT t.transactions_id, t.transaction_status, t.time, t.user_id, 
                u.username, t.warehouse_id, w.warehouse_name
                FROM transactions t join user u join warehouse w
                on t.user_id = u.user_id
                and t.warehouse_id = w.warehouse_id
                where t.warehouse_id = ${db.escape(request.query.warehouse_id)}
                order by time;`
            }

            db.query(scriptQuery, (err, result)=> {
                if (err) {
                    return response.status(500).send(err)
                } else {
                    return response.status(200).send(result)
                    
                }
            })

        }     

    },
    getTransactionItems: (request,response) => {
        let scriptQuery = `SELECT t.transactions_id, t.transaction_status, t.time, t.warehouse_id, t.payment_proof,
        w.warehouse_name,
        p.product_name, p.product_image, p.price_buy, ti.size, ti.quantity, ti.transaction_price,
        u.user_id, u.username
        FROM transaction_items ti join transactions t 
        join products p join user u join warehouse w
        on t.transactions_id = ti.transactions_id 
        and p.product_id = ti.product_id
        and t.user_id = u.user_id
        and t.warehouse_id = w.warehouse_id
        where t.transactions_id = ${db.escape(request.query.transactions_id)}
        order by time;`

        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
                
            }
        })
    },
    getTopThree: (request,response) => {
        console.log("request.query.warehouse_id",request.query.warehouse_id)
        if(request.query.warehouse_id){
            let scriptQuery = `SELECT t.transactions_id, t.transaction_status, t.time, t.warehouse_id,
            w.warehouse_name,
            p.product_name, p.product_image, p.price_buy, ti.size, sum(ti.quantity) as quantity, ti.transaction_price,
            u.user_id, u.username
            FROM transaction_items ti join transactions t 
            join products p join user u join warehouse w
            on t.transactions_id = ti.transactions_id 
            and p.product_id = ti.product_id
            and t.user_id = u.user_id
            and t.warehouse_id = w.warehouse_id
            where t.transaction_status = "paid"
            group by product_name
            order by quantity desc limit 3;`

            if(request.query.warehouse_id>0){
                scriptQuery = `SELECT t.transactions_id, t.transaction_status, t.time, t.warehouse_id,
                w.warehouse_name,
                p.product_name, p.product_image, p.price_buy, ti.size, sum(ti.quantity) as quantity, ti.transaction_price,
                u.user_id, u.username
                FROM transaction_items ti join transactions t 
                join products p join user u join warehouse w
                on t.transactions_id = ti.transactions_id 
                and p.product_id = ti.product_id
                and t.user_id = u.user_id
                and t.warehouse_id = w.warehouse_id
                where t.transaction_status = "paid"
                and t.warehouse_id=${db.escape(request.query.warehouse_id)}
                group by product_name
                order by quantity desc limit 3;`
            }
    
            db.query(scriptQuery, (err, result)=> {
                if (err) {
                    return response.status(500).send(err)
                } else {
                    return response.status(200).send(result)
                    
                }
            })

        }


    },
    timeTransactions: (request,response) => {
        if(request.query.warehouse_id){
            let scriptQuery = `select time from transactions where transaction_status = "paid";`

            if(request.query.warehouse_id>0){
                scriptQuery = `select time from transactions where transaction_status = "paid" and warehouse_id=${db.escape(request.query.warehouse_id)};`
            }
    
            db.query(scriptQuery, (err, result)=> {
                if (err) {
                    return response.status(500).send(err)
                } else {
                    return response.status(200).send(result)
                    
                }
            })

        }
    }

}