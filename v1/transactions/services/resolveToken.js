const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    let authHeader = req.get('Authorization')

    if (!authHeader) {
        // const error =  new Error("Not authenticated");
        // error.statusCode = 401;
        // throw error;
        return res.status(401).send({
            message: "Missing Auth token",
        })
    }
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.supabaseSecrete)
    } catch (error) {
        return res.send({
            success: false,
            message: "Token as expired",
        })
    }
    if (!decodedToken) {

        return res.send({
            success: false,
            message: "Session expired",
        })
    }


    req.email = decodedToken.email; 
    req.Id = decodedToken.buzzID;

    next();
}