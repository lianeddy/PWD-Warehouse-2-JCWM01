const express = require("express");
const cors = require("cors");
const bearerToken = require("express-bearer-token");
const bodyParser = require("body-parser"); //menerjemahkan databody dr url req frontend -> npm install body-parser

const port = 2700; //port
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(bearerToken());
app.use("/public", express.static("public"));

const {
  productsRouter, 
  registerRouter, 
  loginRouter,
  adminRouter,
  uploaderRouter,
} = require("./routers"); //hubungin dgn router

//hubungin routernya juga
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/admin", adminRouter);
app.use("/upload", uploaderRouter);
app.use("/products", productsRouter);

app.listen(port, () => `Server running in port ${port}`);
//running nya pakai npx nodemon index.js
