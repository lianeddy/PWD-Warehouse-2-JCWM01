const mysql = require("mysql");

//tambahan:integrasi dengan mysql
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "fp_pwd_5",
//   port: 3306,
//   multipleStatements: true,
// });

// //connect ke mysql server
// db.connect((err) => {
//   if (err) {
//     return console.log(`error:${err}`);
//   } else {
//     return console.log(`Connected to MYSQL server.`);
//   }
// });

// module.exports = { db };
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: 'asd123',
    database: 'fp_pwd_5',
    port:'3306',
    multipleStatements: true
})

db.connect((err)=> {
    if(err) {
        return console.log(err)

    }
    console.log('connected to MySQL Server')

})

module.exports = { db };
