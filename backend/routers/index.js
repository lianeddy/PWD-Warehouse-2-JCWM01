const keepLoginRouter = require("./keepLoginRouter");
const loginRouter = require("./loginRouter");
const registerRouter = require("./registerRouter");
const productsRouter = require("./productsRouter");
const adminRouter = require("./adminRouter");
const uploaderRouter = require("./uploaderRouter");
const verificationRouter = require("./verificationRouter");
const editAddressRouter = require("./editAddressRouter");
const resetRouter = require("./resetRouter");
const getAllAddress = require("./getAllAddressRouter");
const setDefaultAddressRouter = require("./setDefaultAddressRouter");
const cartRouter = require("./cartRouter");
const warehouseRouter = require("./warehouseRouter");
const transactionRouter = require("./transactionRouter");
const addUserRouter = require('./addUserRouter')

module.exports = {
  setDefaultAddressRouter,
  getAllAddress,
  resetRouter,
  verificationRouter,
  editAddressRouter,
  keepLoginRouter,
  loginRouter,
  registerRouter,
  productsRouter,
  adminRouter,
  uploaderRouter,
  cartRouter,
  warehouseRouter,
  transactionRouter,
  addUserRouter
};
