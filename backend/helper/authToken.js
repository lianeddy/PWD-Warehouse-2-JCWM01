const jwt = require('jsonwebtoken')

module.exports = {
    auth: (req,res,next) => {
        jwt.verify(req.token, "order66", (err, decode)=>{
            if(err) {
                return res.status(401).send("Authentication failed")
            }
            req.user = decode

            next()
        })
    }
}