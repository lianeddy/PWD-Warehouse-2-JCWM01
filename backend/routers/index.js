const keepLoginRouter = require('./keepLoginRouter')
const loginRouter = require('./loginRouter')
const registerRouter = require('./registerRouter')
const productsRouter = require('./productsRouter')
const adminRouter = require('./adminRouter')
const uploaderRouter  = require('./uploaderRouter')
const verificationRouter = require('./verificationRouter')

module.exports = { verificationRouter,  keepLoginRouter, loginRouter, registerRouter, productsRouter, adminRouter, uploaderRouter }