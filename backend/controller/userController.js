
const { db } = require('../database')

module.exports = {

    addUser: (req, res) => {
        // console.log(req.body)
        let { username, email, password, fullname, gender, age, auth_status } = req.body
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
            db.query(`SELECT * FROM user WHERE username = ${db.escape(username)};`, (err2, results2) => {
                if (err2) return res.status(500).send(err2)
                return res.status(200).send({ message: 'registration succesfull', data: results2 })
                
            })
        }) 
    },

    getUser: (req,res) => {
        let { username, password } = req.body;
        // console.log(username, password)
        db.query(`SELECT * FROM user WHERE username = ? AND password = ?`, [username, password],
        (err, result) => {
            if (err) {
                res.send(err)
            }
            if (result.length > 0) { //
                res.send(result)
            } else {
                res.send({ message: "Wrong username or password" })
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

