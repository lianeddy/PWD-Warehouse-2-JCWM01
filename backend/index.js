const express = require("express");
const cors = require("cors");
const bearerToken = require("express-bearer-token");

const port = 2700; //port
const app = express();

app.use(cors());
app.use(express.json());
app.use(bearerToken());

const { 
    productsRouter, 
    addUserRouter } = require("./routers"); //hubungin dgn router

// app.use("/products", productsRouter); //hubungin routernya juga
// app.use("/register", addUserRouter);
app.use("/login", addUserRouter);

app.listen(port, () => console.log(`Server running in port ${port}`));
//running nya pakai npx nodemon index.js
