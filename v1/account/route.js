const router = require("express").Router();

const {userData} = require("./controller") 

const isAuth = require("./services/resolveToken")

 
router.post("/user_details", userData)  

module.exports = router