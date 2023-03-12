const router = require("express").Router(); 
const { signin, signup, Courses} = require("./controller") 

router.post("/signin", signin)
router.post("/signup", signup)  
router.post("/courses", Courses)  

module.exports = router