const router = require("express").Router();

const {getTransactions} = require("./controllers") 

const isAuth = require("./services/resolveToken")

 
router.get("/all",isAuth, getTransactions)  

module.exports = router