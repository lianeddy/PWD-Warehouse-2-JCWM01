const {db} = require('../database'); //akses file (baca/tulis)
const { warehouse } = require('./adminController');

module.exports = {
    addTransaction: (request,response) => {
        const default_status = "pending"
        var now = new Date();
        let currentTime = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '+now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

        let warehouseList = []
        warehouseList = request.body.warehouseList
        console.log(warehouseList)

        //update transactions table
        //REVISI update warehouse_id
        let createQuery = `insert into transactions values (null, ${db.escape(currentTime)}, ${db.escape(request.body.user_id)}, ${db.escape(default_status)}, null, ${db.escape(warehouseList[0].warehouse_id)});`

        db.query(createQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                //ini untuk table transaction_items
                const transactions_id = result.insertId

                let cartData = []
                cartData = request.body.cartList
                let cartQuery = ``

                cartData.map((val,key)=> {
                    if(key!==cartData.length-1){
                        return cartQuery = cartQuery + `(null, ${db.escape(transactions_id)}, ${db.escape(val.product_id)}, ${db.escape(val.size)}, ${db.escape(val.quantity)}, ${db.escape(val.price_sell)}),`
                    } else {
                        return cartQuery = cartQuery + `(null, ${db.escape(transactions_id)}, ${db.escape(val.product_id)}, ${db.escape(val.size)}, ${db.escape(val.quantity)}, ${db.escape(val.price_sell)});`
                    }
                })

                let createItemsQuery = `insert into transaction_items values ${cartQuery}`

                db.query(createItemsQuery, (err, result)=> {
                    if (err) {
                        return response.status(500).send(err)
                    } 
                    else {
                        let scriptQuery = `select * from transactions t join
                        transaction_items ti on t.transactions_id = ti.transactions_id 
                        where t.transactions_id = ${db.escape(transactions_id)}`
        
                        db.query(scriptQuery, (err, result)=> {
                            if (err) {
                                return response.status(500).send(err)
                            } else {
                                return response.status(200).send(result)
                            }
                        })

                    }
                })

            }
        })
    },
    cancelTransaction: (request,response) => {
        //map semua barang di cart, select dulu warehouse_stock nya, abis itu update user_stocknya
        let cartList = request.body.cartList
        let warehouseList = request.body.warehouseList

        let cartQuery = ``
        cartList.map((val)=>{
            for(i=0;i<warehouseList.length;i++){
                
                let current_warehouse_id = warehouseList[i].warehouse_id

                let searchQuery = `select warehouse_stock from warehouse_stock 
                where warehouse_id= ${db.escape(current_warehouse_id)} 
                and product_id = ${db.escape(val.product_id)}
                and size = ${db.escape(val.size)};`

                db.query(searchQuery, (err, result)=> {
                    if (err) {
                        return response.status(500).send(err)
                    } else {
                        if(result[0]){
                            let warehouse_stock = result[0].warehouse_stock
    
                            let changeQuery = `update warehouse_stock set user_stock = ${db.escape(warehouse_stock)}
                            where warehouse_id= ${db.escape(current_warehouse_id)} 
                            and product_id = ${db.escape(val.product_id)}
                            and size = ${db.escape(val.size)}; `
    
                            cartQuery = cartQuery + changeQuery

                            db.query(cartQuery, (err, result)=> {
                                if (err) {
                                    return response.status(500).send(err)
                                } else {
                                    // return response.status(200).send(result)
                                }
                            })
                        }
                    }
                })
            }
        })

        // delete request dengan transaction_id tsb di request_table
        let requestQuery = `delete from request where transactions_id = ${db.escape(request.query.transactions_id)};`

        //ganti status di transactions jadi "user_cancelled"
        let transactionQuery = `update transactions set transaction_status = "user_cancelled" where transactions_id = ${db.escape(request.query.transactions_id)};`

        let scriptQuery = `${requestQuery}`+`${transactionQuery}`
        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })

    },
    continuePayment: (request,response) => {
        //warehouse_stock dengan transaction_id itu harusnya disamain sama user_stock
        let cartList = request.body.cartList
        let warehouseList = request.body.warehouseList

        let cartQuery = ``
        cartList.map((val)=>{
            for(i=0;i<warehouseList.length;i++){
                
                let current_warehouse_id = warehouseList[i].warehouse_id

                let searchQuery = `select user_stock from warehouse_stock 
                where warehouse_id= ${db.escape(current_warehouse_id)} 
                and product_id = ${db.escape(val.product_id)}
                and size = ${db.escape(val.size)};`

                db.query(searchQuery, (err, result)=> {
                    if (err) {
                        return response.status(500).send(err)
                    } else {
                        if(result[0]){
                            let user_stock = result[0].user_stock
    
                            let changeQuery = `update warehouse_stock set warehouse_stock = ${db.escape(user_stock)}
                            where warehouse_id= ${db.escape(current_warehouse_id)} 
                            and product_id = ${db.escape(val.product_id)}
                            and size = ${db.escape(val.size)}; `
    
                            cartQuery = cartQuery + changeQuery

                            db.query(cartQuery, (err, result)=> {
                                if (err) {
                                    return response.status(500).send(err)
                                } else {
                                    // return response.status(200).send(result)
                                }
                            })
                        }
                    }
                })
            }
        })

        //cart clear
        let deleteQuery = `delete from cart_items where cart_id = ${db.escape(request.query.cart_id)};`

        db.query(deleteQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                //status berubah jadi waiting_payment
                const default_status = "waiting_payment"
                let updateQuery = `update transactions set transaction_status = ${db.escape(default_status)} where transactions_id = ${db.escape(request.query.transactions_id)}`

                db.query(updateQuery, (err, result)=> {
                    if (err) {
                        return response.status(500).send(err)
                    } else {
                        return response.status(200).send(result)
                    }
                })
            }
        })

    },
    createRequestStock: (request,response) => {

        let cartList = []
        let warehouseList = []

        cartList = request.body.cartList
        warehouseList = request.body.warehouseList
        transactions_id = request.body.transactions_id

        let warehouseQuery = `update transactions set warehouse_id = ${db.escape(warehouseList[0].warehouse_id)} where transactions_id = ${db.escape(request.body.transactions_id)} `
        db.query(warehouseQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                // return response.status(200).send(result)
            }
        })

        cartList.map((val)=>{
            let i = 0
            let neededStock = 0

            while (i < warehouseList.length){
                let checkQuery = `select user_stock from warehouse_stock 
                where product_id = ${db.escape(val.product_id)} 
                and size = ${db.escape(val.size)}
                and warehouse_id = ${db.escape(warehouseList[i].warehouse_id)}`

                let first_warehouse_name = warehouseList[0].warehouse_name
                let first_warehouse_id = warehouseList[0].warehouse_id
                let first_warehouse_location = warehouseList[0].warehouse_location

                let urutan = i
                let current_warehouse_name = warehouseList[i].warehouse_name
                let current_warehouse_id = warehouseList[i].warehouse_id
                let current_warehouse_location = warehouseList[i].warehouse_location

                db.query(checkQuery, (err, result)=> {
                        if (err) {
                            return response.status(500).send(err)
                        } else {

                            if(urutan===0){
                            neededStock = val.quantity
                            }

                            if(result[0]){
                                user_stock = result[0].user_stock
                            } else {
                                user_stock = 0
                            }

                            if(user_stock>=neededStock){ //kalo stock di warehouse ini cukup (sama dengan atau lebih dari needed)
                                //ambil dari warehouse itu sebanyak needed
                                if(neededStock!==0){
                                    if(first_warehouse_name===current_warehouse_name){ //kalo warehouse pertama cuma ambil(bukan request)
                                        //kurangi user_stock di warehouse ini dengan needed stock

                                        let minQuery = `update warehouse_stock set user_stock = ${db.escape(user_stock-neededStock)} 
                                        where warehouse_id = ${db.escape(current_warehouse_id)}
                                        and product_id = ${db.escape(val.product_id)}
                                        and size = ${db.escape(val.size)};`

                                        db.query(minQuery, (err, result)=> {
                                            if (err) {
                                                return response.status(500).send(err)
                                            } else {
                                                console.log(`urutan ${urutan} `,"update warehouse_stock table")
                                                // return response.status(200).send(result)
                                            }
                                        })

                                    }else{
                                        const default_status = "unconfirmed"
                                        //kurangi user_stock pada table warehouse_stock di warehouse ini dengan needed stock
                                        //bawahnya untuk update request table dengan (null,val.product_id,val.size,first_warehouse_name,current_warehouse_name,neededStock,"unconfirmed")

                                        let minQuery = `update warehouse_stock set user_stock = ${db.escape(user_stock-neededStock)} 
                                        where warehouse_id = ${db.escape(current_warehouse_id)}
                                        and product_id = ${db.escape(val.product_id)}
                                        and size = ${db.escape(val.size)};
                                        
                                        insert into request value 
                                                (null,${db.escape(val.product_id)},${db.escape(val.size)},${db.escape(first_warehouse_id)},${db.escape(current_warehouse_id)},
                                                ${db.escape(neededStock)},${db.escape(default_status)},${db.escape(transactions_id)});`
                                        
                                        db.query(minQuery, (err, result)=> {
                                            if (err) {
                                                return response.status(500).send(err)
                                            } else {
                                                console.log(`urutan ${urutan} `,"update request table and warehouse_stock table")
                                                // return response.status(200).send(result)
                                            }
                                        })


                                    }
                                    //udah ga butuh stock lagi jadinya, yeayy
                                    neededStock = 0
                                }


                            } 
                            else{ //kalo stock nya ga cukup
                                //ambil maksimum stock yang ada
                                if(neededStock!==0){
                                    if(first_warehouse_name===current_warehouse_name){ //kalo warehouse pertama cuma ambil(bukan request)
                                        //kurangi user_stock di warehouse ini dengan useer_stock alias dibikin 0
                                        let minQuery = `update warehouse_stock set user_stock = ${db.escape(user_stock-user_stock)} 
                                        where warehouse_id = ${db.escape(current_warehouse_id)}
                                        and product_id = ${db.escape(val.product_id)}
                                        and size = ${db.escape(val.size)};`

                                        db.query(minQuery, (err, result)=> {
                                            if (err) {
                                                return response.status(500).send(err)
                                            } else {
                                                console.log(`urutan ${urutan} `,"update warehouse_stock table")
                                            }
                                        })

                                    }else{
                                        const default_status = "unconfirmed"
                                        //kurangi user_stock di warehouse ini dengan useer_stock alias dibikin 0
                                        //bawahnya untuk update request table dengan (null,val.product_id,val.size,first_warehouse_name,current_warehouse_name,user_stock,"unconfirmed")
                                        let minQuery = `update warehouse_stock set user_stock = ${db.escape(user_stock-user_stock)} 
                                        where warehouse_id = ${db.escape(current_warehouse_id)}
                                        and product_id = ${db.escape(val.product_id)}
                                        and size = ${db.escape(val.size)};
                                        
                                        insert into request value 
                                                (null,${db.escape(val.product_id)},${db.escape(val.size)},${db.escape(first_warehouse_id)},${db.escape(current_warehouse_id)},
                                                ${db.escape(user_stock)},${db.escape(default_status)},${db.escape(transactions_id)});`

                                        db.query(minQuery, (err, result)=> {
                                            if (err) {
                                                return response.status(500).send(err)
                                            } else {
                                                console.log(`urutan ${urutan} `,"update request table and warehouse_stock table")
                                            }
                                        })

                                    }
                                    neededStock = neededStock - user_stock
                                    //cari dari warehouse lain
                                }

                            }

                        }
                })
                i++
            }
        })
    },
    payHandler: (request,response) => {
        //ganti status di transactions jadi "paid"
        let payQuery = `update transactions set transaction_status = "paid" where transactions_id = ${db.escape(request.query.transactions_id)};`

        db.query(payQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    }
}