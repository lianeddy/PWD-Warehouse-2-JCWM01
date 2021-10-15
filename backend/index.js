const express = require('express')
const cors = require('cors')
const bearerToken = require('express-bearer-token')

const port = 2700;
const app = express();

app.use(cors())
app.use(express.json())
app.use(bearerToken())


const { registerRouter, loginRouter } = require('./routers')

app.use('/register', registerRouter)
app.use('/login', loginRouter)

app.listen(port, ()=> console.log(`server running on port: ${port}`))




