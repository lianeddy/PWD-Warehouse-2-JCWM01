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
    hideProduct: (request,response) => {
        let sqlHide = `Update fp_pwd_5.products set hide = 0 where product_id = ${db.escape(request.query.product_id)};`
    
        db.query(sqlHide, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {

                return response.status(200).send(result)
                
            }
        })
    },
    showProduct: (request,response) => {
        let sqlShow = `Update fp_pwd_5.products set hide = 1 where product_id = ${db.escape(request.query.product_id)};`
    
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
            FROM fp_pwd_5.transaction_items ti join fp_pwd_5.transactions t 
            join fp_pwd_5.products p join fp_pwd_5.user u join fp_pwd_5.warehouse w
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
                FROM fp_pwd_5.transaction_items ti join fp_pwd_5.transactions t 
                join fp_pwd_5.products p join fp_pwd_5.user u join fp_pwd_5.warehouse w
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
            FROM fp_pwd_5.transactions t join fp_pwd_5.user u join fp_pwd_5.warehouse w
            on t.user_id = u.user_id
            and t.warehouse_id = w.warehouse_id
            where t.warehouse_id = 1
            order by time;`

            if(request.query.warehouse_id>0){
                scriptQuery = `SELECT t.transactions_id, t.transaction_status, t.time, t.user_id, 
                u.username, t.warehouse_id, w.warehouse_name
                FROM fp_pwd_5.transactions t join fp_pwd_5.user u join fp_pwd_5.warehouse w
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
        FROM fp_pwd_5.transaction_items ti join fp_pwd_5.transactions t 
        join fp_pwd_5.products p join fp_pwd_5.user u join fp_pwd_5.warehouse w
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
            FROM fp_pwd_5.transaction_items ti join fp_pwd_5.transactions t 
            join fp_pwd_5.products p join fp_pwd_5.user u join fp_pwd_5.warehouse w
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
                FROM fp_pwd_5.transaction_items ti join fp_pwd_5.transactions t 
                join fp_pwd_5.products p join fp_pwd_5.user u join fp_pwd_5.warehouse w
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
            let scriptQuery = `select time from fp_pwd_5.transactions where transaction_status = "paid";`

            if(request.query.warehouse_id>0){
                scriptQuery = `select time from fp_pwd_5.transactions where transaction_status = "paid" and warehouse_id=${db.escape(request.query.warehouse_id)};`
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

/*

OLAH DATANYA DI FRONTEND AJALAH (warehosue):
-> declare STATE transMonth = []
-> declare DI DALAM FUNCTION transMonth = [
    {month: january, transactions: 0},
    {month: february, transactions: 0},
    {month: march, transactions: 0},
    {month: april, transactions: 0},
    {month: may, transactions: 0},
    {month: june, transactions: 0},
    {month: july, transactions: 0},
    {month: august, transactions: 0},
    {month: september, transactions: 0},
    {month: october, transactions: 0},
    {month: november, transactions: 0},
    {month: december, transactions: 0},
]
-> map monthList, pake switch case  kalau 01 -> case transMonth[0].transactions = transmonth[0].transaction+1
                                    kalau 02 -> case transMonth[1].transactions = transmonth[1].transaction+1 dst..
-> this.setState({transMonth: transMonth})
-> bakal jadi transMonth isinya grafik month (x) vs. transaksi (y)

OLAH DATANYA DI FRONTEND AJALAH (superadmin):
- sama kayak warehouse bedanya bisa milih mau liat semua apa liat satu satu tiap warehouse


QUERY MONTH VS SALES QUANTITY TRANSACTION GRAPH (superadmin)
select * from fp_pwd_5.transactions t join 
(select transactions_id, sum(quantity) as quantity from fp_pwd_5.transaction_items group by transactions_id) ti
on t.transactions_id = ti.transactions_id
where t.transaction_status = "paid"
order by time;

QUERY MONTH VS SALES QUANTITY TRANSACTION GRAPH (superadmin)
select * from fp_pwd_5.transactions t join 
(select transactions_id, sum(quantity) as quantity from fp_pwd_5.transaction_items group by transactions_id) ti
on t.transactions_id = ti.transactions_id
where t.transaction_status = "paid"
and warehouse_id=${db.escape(request.query.warehouse_id)}
order by time;

OLAH DATANYA DI FRONTEND AJALAH (warehosue):
samain kayak monthTransaction(ini jadi monthSales ato apa kek)

*/