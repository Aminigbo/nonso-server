// User model
const { userModel } = require("../models/users/user_models")
let jwt = require("jsonwebtoken");

const error = (res, msg) => {
    res.send({
        success: false,
        data: null,
        message: msg,
    })
}



const success = (res, data) => {
    res.send({
        success: true,
        message: "Successful",
        data: {
            ...data

        }
    })
}



const userData = (req, res) => {
    const {Email} = req.body
    return userModel.getUserByEmail(Email).then(response => {
        const token = jwt.sign({
            email: response.data.data[0].email,
            id: response.data.data[0].buzzID
        }, process.env.supabaseSecrete, { expiresIn: '24h' });

        success(res, {
            metadata: {
                ...response.data.user_metadata,
                wallet: response.data.data[0].wallet
            },
            // token:response.data.token.data.access_token
            token
        })
    })
}

module.exports = {
    userData
}