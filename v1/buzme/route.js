const router = require("express").Router();

const {getAllUsersBuzme, requestBuzme,sendBuzme} = require("./controller") 

// router.post("/create", create_cashback) 
router.post("/buz_user", sendBuzme) 
router.post("/request_buzme", requestBuzme) 
router.get("/getBuzme_record", getAllUsersBuzme) 

module.exports = router