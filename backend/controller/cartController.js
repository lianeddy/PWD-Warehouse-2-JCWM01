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
        let scriptQuery = `insert into fp_pwd_5.cart_items values (null,${db.escape(request.body.cart_id)},
                            ${db.escape(request.body.product_id)},${db.escape(request.body.size)},${db.escape(request.body.quantity)});`

        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },
}