const { db } = require('../database');
const Crypto = require('crypto');
const { createToken }= require('../helper/createToken')
const transporter = require('../helper/nodemailer')

module.exports = {

    registerUser: (req, res) => {
        console.log("Connecting to register API success")
        let { username, email, password, fullname, gender, age, auth_status } = req.body
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
                let sqlGet =`SELECT * from user where user_id = ${results.insertId}`
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
                        from:`Annett's admin <kevinnp28@gmail.com`,
                        to: `${email}`,
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
                })
            }
            db.query(`SELECT * FROM user WHERE username = ${db.escape(username)};`, (err2, results2) => {
                if (err2) return res.status(500).send(err2)
                return res.status(200).send({ message: 'registration succesfull', data: results2 })
            })
        }) 
    },

    //Verification middleware
    verifyUser:(req, res) =>{
        let updateQuery = `Update user set verification_status = 'verified' where user_id =${req.user.user_id}`
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
        console.log(`req.body is set at ${req.body}`)
        req.body.password = Crypto.createHmac("sha1", "hash123").update(password).digest("hex");
        let scriptQuery = `SELECT * FROM user WHERE username = ${db.escape(req.body.username)} AND password = ${db.escape(req.body.password)}`;
        db.query(scriptQuery, (err, result) => {
            console.log(`${scriptQuery} is running`)
            if (err) {
                return res.send({err, message: "Wrong username or password"})
            }
            console.log(`result is ${result[0]}`)
            if (result[0]) {  //create token
                let { user_id, username, email, verification_status } = result[0]
                console.log(`result[0] is set for ${result[0].username}`)
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
    
    keepLogin: (req,res) => {
        db.query(`SELECT * FROM user WHERE username = ${db.escape(req.query.username)}`,
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
}

