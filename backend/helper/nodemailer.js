const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'kevinnp28@gmail.com',
        pass: 'vavhcsbkylfhwxaa'
    },
    tls: {
        rejectUnathorized: false
    }
})

module.exports = transporter
