const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'outerhaven67@gmail.com',
        pass: 'nnlwwgvbusdcgjvq'
    },
    tls: {
        rejectUnathorized: false
    }
})

module.exports = transporter
