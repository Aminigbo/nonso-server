const md5 = require("md5");
const { LoginFetchUser_model, Login_model } = require("../../models/auth");

const error = (res, msg) => {
    res.send({
       success: false,
       message: msg,
    })
 }

const Login = (req, res) => {
    let { email, password} = req.body; 

    LoginFetchUser_model(email).then(user_data => {
        if (user_data.data.length < 1) {
           error(res, "Invalid account")
        } else {
            const data = user_data.data[0].data
            // check for password combo
            const hashed_password = md5(password + email);
            if (data.isVendor == false) {
                error(res,"You have no access to this portal") 
            } else { 
                Login_model({
                    email: email,
                    password: hashed_password
                }).then(loggedIn => {
                    if (loggedIn.session == null) {
                        error(res, loggedIn.error.message) 
                    } else {
                        res.send({
                            success:true,
                            message:"Successful",
                            data:loggedIn.data
                        })
                    }
                })
            }
        }
    })
}



module.exports = {
    Login,
};