const express = require('express')
const cors = require('cors') 
const bodyParser = require('body-parser') 

const port = 2700 //port 
const app = express() 

app.use(cors())
app.use(bodyParser.json())
app.use(express.json()) 

const { productsRouter } = require('./router')//hubungin dgn router

app.use('/products',productsRouter) //hubungin routernya juga

app.listen(port,()=> console.log(`Server running in port ${port}`))
//running nya pakai npx nodemon index.js
