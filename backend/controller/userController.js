
const { db } = require('../database')

module.exports = {
    addUser: (req, res) => {
        console.log(req.body)
        let { username, email, password, fullname, gender, age, auth_status } = req.body
        let insertQuery = `Insert into user (username, email, password, fullname, gender, age, auth_status) values (
        ${db.escape(username)},
        ${db.escape(email)},
        ${db.escape(password)},
        ${db.escape(fullname)},
        ${db.escape(gender)},
        ${db.escape(age)},
        ${db.escape(auth_status)});`
        console.log(insertQuery)
        db.query(insertQuery, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).send(err)
            }
            db.query(`Select * from user where username = ${db.escape(username)};`, (err2, results2) => {
                if (err2) return res.status(500).send(err2)
                return res.status(200).send({ message: 'registration succesfull', data: results2 })
                
            })
        }) 
    }
}