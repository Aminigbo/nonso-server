const router = require("express").Router(); 
const {Buz_alert} = require("./controllers/buz-alert")  
const {Create_cashtoken} = require("./controllers/create-cashtoken")  
const {Resolve_cashback} = require("./controllers/resolve-cashback")  

router.post("/buz-alert", Buz_alert) 
router.post("/create-cashtoken", Create_cashtoken) 
router.post("/resolve-cashtoken", Resolve_cashback) 

module.exports = router