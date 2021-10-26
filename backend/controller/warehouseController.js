const {db} = require('../database') //akses file (baca/tulis)

module.exports = {
    getWarehouseData: (request,response) => {
        let scriptQuery = `select * from fp_pwd_5.warehouse;`
        db.query(scriptQuery, (err, result)=> {
            if (err) {
                return response.status(500).send(err)
            } else {
                return response.status(200).send(result)
            }
        })
    },
}