const express = require('express')
const cors = require('cors')
const bearerToken = require('express-bearer-token')

const port = 2601;
const app = express();

app.use(cors())
app.use(express.json())
app.use(bearerToken())


const { addUserRouter } = require('./routers')

app.use('/register', addUserRouter)
app.use('/login', addUserRouter)

app.listen(port, ()=> console.log(`server running on port: ${port}`))




