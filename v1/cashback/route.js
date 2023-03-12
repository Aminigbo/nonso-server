const router = require("express").Router();

const {create_cashback,verifyCashbackToken,resolveToken,getAllUsersCashback} = require("./controller") 

router.post("/create", create_cashback) 
router.get("/verify_token", verifyCashbackToken) 
router.post("/resolve_token", resolveToken) 
router.get("/get_token", getAllUsersCashback) 

module.exports = router