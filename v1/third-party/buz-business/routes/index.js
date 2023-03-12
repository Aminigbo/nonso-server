const { Login } = require("../controllers/auth");

const router = require("express").Router();  

router.use("/auth", Login)


module.exports = router