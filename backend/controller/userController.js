const { db } = require('../database');
const Crypto = require('crypto');
const { createToken }= require('../helper/createToken')
const transporter = require('../helper/nodemailer')

module.exports = {

    registerUser: (req, res) => {
        let { username, email, password, fullname, gender, age, auth_status } = req.body
        console.log(`Connecting to register API success, user email is ${req.body.email}`)
        password = Crypto.createHmac("sha1", "hash123").update(password).digest("hex");
        let insertQuery = `Insert into user (username, email, password, fullname, gender, age, auth_status) values (
        ${db.escape(username)},
        ${db.escape(email)},
        ${db.escape(password)},
        ${db.escape(fullname)},
        ${db.escape(gender)},
        ${db.escape(age)},
        ${db.escape(auth_status)});`

        db.query(insertQuery, (err, results) => {
            
            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }

            console.log("Success Processing register API")

            if(results.insertId) {
                const insertId = results.insertId
                //REVISI jadinya pas register harus tambah cart yaa karena pas login cart nya dipanggil
                let sqlGet =`SELECT * from user where user_id = ${results.insertId};`
                
                db.query(sqlGet, (err2, results2)=> {
                    if(err2) {
                        console.log(err2)
                        return res.status(500).send(err2)
                    }

                    //Token creation
                    let { user_id, username, email, verification_status  } = results2[0]
                    let token = createToken ({ user_id, username, email, verification_status })

                    console.log("Create Token successful")

                    //Email verification format
                    let mail = { 
                        from:`Annett's admin <outerhaven67@gmail.com>`,
                        to: `${req.body.email}`,
                        subject: 'Account Verification',
                        html:`<a href='http://localhost:3000/auth/${token}'>Click here to verify your account!</a>`
                    }

                    //Verification sending's protocol
                    transporter.sendMail(mail,(errMail, resMail)=>{
                        if(errMail){
                            console.log(errMail)
                            return res.status(500).send({ message: "Registration failed", success: false, err:errMail})
                        } 
                        return res.status(200).send({ message: "Registration in process, please check your", success: true})
                    })

                    db.query(`insert into cart values (null, ${db.escape(user_id)}); SELECT * FROM user WHERE username = ${db.escape(username)};`, (err3, results3) => {
                        if (err3) return res.status(500).send(err3)
                        return res.status(200).send({ message: 'registration succesfull', data: results3 })
                    })
                })
                

            }

        }) 
    },

    //Verification middleware
    verifyUser:(req, res) =>{
        let updateQuery = `Update user set verification_status = 'verified' where user_id = ${req.user.user_id};`
        db.query(updateQuery,(err,results)=>{
            if(err){
                console.log(err)
                return res.status(500).send(err)
            }
            return res.status(200).send({message: "Verified Account", success:true })
        })
    },

    loginUser: (req,res) => {
        let { username, password } = req.body;
        console.log(`logging in into ${req.body.username} account'`)
        req.body.password = Crypto.createHmac("sha1", "hash123").update(password).digest("hex");
        //REVISI supaya ambil cart_id (bikin error ketika delete items in cart)
        let scriptQuery = `SELECT * FROM user u join (select * from cart) c
        on u.user_id = c.user_id WHERE u.username = ${db.escape(req.body.username)} AND u.password = ${db.escape(req.body.password)}`;
        db.query(scriptQuery, (err, result) => {
            //console.log(`${scriptQuery} is running`)
            if (err) {
                return res.send({err, message: "Wrong username or password"})
            }
            console.log(result[0])
            if (result[0]) {  //create token    
                let { user_id, username, email, verification_status } = result[0]
                //console.log(`result[0] is set for ${result[0].username}`)
                let token = createToken({ user_id, username, email, verification_status })
                console.log("Create Token successful")
                if(verification_status !== "verified") {
                   console.log("Account has not been verified since your registration, please check your email and complete verification process")
                   return res.status(200).send({ message: "Your account hasn't verified yet"})
                } else {
                    console.log("Account has been verified")
                   return res.status(200).send({ dataLogin: result[0], token, message:"Login Success"})
                }
            } else {
                console.log(`result[0] is ${result[0]}`)
            }
        })
    },

    editAddress: (req,res) => {
        let { user_id, address, user_location, default_address } = req.body
        //console.log(req.body)
        let insertQuery = `INSERT into address (user_id, user_address, user_location, default_address) values (${db.escape(user_id)},${db.escape(address)},${db.escape(user_location)},${db.escape(default_address)});`
        db.query(insertQuery, (err, result) => {
            console.log(result)
                if(result) {
                    db.query(`SELECT user_address FROM address WHERE user_id = ${db.escape(user_id)};`, (err2, results2) => {
                        if (err2) return res.status(500).send(err2)
                        return res.status(200).send({ message: 'Change Address', data: results2 })
                    })
                }
            if (err) {
                return res.send({err, message: "Wrong input"})
            }
        })
    },
    
    checkUsername: (req, res) => {
        let { usernameCheck } = req.body
        //console.log(req.body)
        let checkQuery = `SELECT user.username FROM user where username = ${db.escape(usernameCheck)};`
        db.query(checkQuery, (err, result)=>{
            console.log(`result is ${result}`)
            if(result){
                return res.status(200).send(result)
            } else if (err) {
                return res.status(500).send(err) 
            } else {
                return res.status(500).send({ err, message: "Something's wrong"}) 
            }
        })
    },

    keepLogin: (req,res) => {
        //REVISI supaya ambil cart_id (bikin error ketika delete items in cart)
        db.query(`SELECT * FROM user u join (select * from cart) c
        on u.user_id = c.user_id WHERE u.user_id = ${req.user.user_id}`,
        (err, result) => {
            if (err) {
                return res.send(err)
            }
            console.log(req.user)
            return res.send(result)
            
        })
    },

    getAllAddress: (req,res) => {
        db.query(`SELECT * FROM address WHERE user_id = ${db.escape(req.query.user_id)}`,
        (err, result) => {
            if (err) {
                res.send(err)
            }
            if (result.length > 0) {
                res.send(result)
            } else {
                res.send({ message: "Wrong username or password" })
            }
            
        })
    },

    patchPassword: (req,res) => {
        let { password, email, user_id } = req.body;
        console.log(`req.body detected at ${req.body}`)
        req.body.password = Crypto.createHmac("sha1", "hash123").update(req.body.password).digest("hex");
        const findEmail = `SELECT * FROM user WHERE email = ${db.escape(req.body.email)}`
        const editPassword = `UPDATE user SET password = ${db.escape(req.body.password)} WHERE user_id = ${db.escape(req.body.user_id)}`;        
        db.query(findEmail, (err)=>{
            if (err) { 
                return res.status(500).send(err);
            } if (req.body.email) {
                db.query(editPassword, (err) => {
                  if (err) return res.status(500).send(err);
                  return res.status(200).send("password changed");
                })
            }
        })
    },

    setDefault: (req,res) => {
        let { address } = req.body;
        console.log(`${address}, and ${req.query.user_id}`)
        const patchQuery = `UPDATE address SET default_address = 0 WHERE user_id = ${db.escape(req.query.user_id)}; UPDATE address SET default_address = 1 WHERE user_id = ${db.escape(req.query.user_id)} AND user_address = ${db.escape(req.body.address)}`;        
        db.query(patchQuery, (err, result)=>{
             if (result) {
                  return res.status(200).send("Address default set");
                } else {
                    return res.status(500).send(err);
                }
            }
        )
    },
    
    getAddress: (req,response) => {
        let scriptQuery = `SELECT user_id, user_address, user_location FROM address WHERE default_address= 0 AND user_id = ${db.escape(req.query.user_id)};`
        db.query(scriptQuery, (err, res) => {
            console.log(res)
            if (err) {
                return response.send(err)
            } else {
                return response.status(200).send(res)
            }
            
        })
    },

    getDefaultAddress: (req,response) => {
        let scriptQuery = `select user_id, user_address, user_location from address where default_address= 1 and user_id = ${db.escape(req.query.user_id)};`
        db.query(scriptQuery, (err, res) => {
            if (err) {
                return response.send(err)
            } else {
                return response.status(200).send(res)
            }
            
        })
    },
}

