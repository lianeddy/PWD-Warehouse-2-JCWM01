const mysql = require('mysql')

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: 'asd123',
    database: 'new_schema',
    port:'3306',
    multipleStatements: true
})

db.connect((err)=> {
    if(err) {
        return console.log(err)

    }
    console.log('connected to MySQL Server')


})

module.exports = { db }