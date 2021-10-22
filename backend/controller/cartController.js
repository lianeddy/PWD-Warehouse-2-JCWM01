const {db} = require('../database') //akses file (baca/tulis)

module.exports = {
    getCartID: (request,response) => {
        let scriptQuery = `select * from fp_pwd_5.cart where user_id = ${db.escape(request.query.user_id)};`

        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                if(result[0]){ //kalo udah ada cart id nya
                    return response.status(200).send(result)
                }
                else { //kalo cart id nya blm ada
                    let createQuery = `insert into fp_pwd_5.cart values (null,${db.escape(request.query.user_id)})`
                    db.query(createQuery, (err, result)=> {
                        if (err) {
                            return response.status(500).send(err)
                        } else {
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

            }
        })
    },
    addCartItems: (request,response) => {
        //cek dulu ada gak barangnya di cart
        let checkQuery = `select * from fp_pwd_5.cart_items where cart_id = ${db.escape(request.body.cart_id)} and product_id = ${db.escape(request.body.product_id)}
        and size = ${db.escape(request.body.size)}` 

        db.query(checkQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                console.log(result[0])
                if(result[0]){ //kalo ada, update aja qty nya
                    console.log("produk sudah ada")
                    let updateQuery = `update fp_pwd_5.cart_items set quantity=${db.escape(result[0].quantity+request.body.quantity)} 
                    where cart_id = ${db.escape(request.body.cart_id)} and product_id = ${db.escape(request.body.product_id)}
                    and size = ${db.escape(request.body.size)};`

                    db.query(updateQuery, (err, result)=> {
                        if (err) {
                            return response.status(500).send(err)
                        } else {
                            return response.status(200).send(result)
                        }
                    })
                }
                else{
                    let scriptQuery = `insert into fp_pwd_5.cart_items values (null,${db.escape(request.body.cart_id)},
                    ${db.escape(request.body.product_id)},${db.escape(request.body.size)},${db.escape(request.body.quantity)});`

                    db.query(scriptQuery, (err, result)=> {
                        if (err) {
                            return response.status(500).send(err)
                        } else {
                            return response.status(200).send(result)
                        }
                    })
                }
                
            }
        })


    },
    getCartItems: (request,response) => {
        let scriptQuery = `select c.user_id as user_id, c.cart_id as cart_id,
        ci.product_id as product_id, ci.size as size, ci.quantity as quantity,
        p.product_name as product_name, p.price_buy as price_buy, 
        p.price_sell as price_sell, p.product_image as product_image
        from fp_pwd_5.cart_items ci, fp_pwd_5.cart c, fp_pwd_5.products p 
        where ci.product_id = p.product_id and ci.cart_id = c.cart_id 
        and c.user_id = ${db.escape(request.query.user_id)};`

        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },
    deleteCartItems: (request,response) => {

        let deleteQuery = `delete from fp_pwd_5.cart_items where cart_id = ${db.escape(request.body.cart_id)} and product_id = ${db.escape(request.body.product_id)}
        and size = ${db.escape(request.body.size)}` 

        db.query(deleteQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },
    
}