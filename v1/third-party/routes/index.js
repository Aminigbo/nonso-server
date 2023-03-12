const router = require("express").Router();  

router.use("/buz-business", require("../buz-business/routes/index"))


module.exports = router;