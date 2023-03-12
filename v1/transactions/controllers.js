// User model
const { transactionModel } = require("../models/reansactions/cashbackModel")
const { userModel } = require("../models/users/user_models")
let jwt = require("jsonwebtoken");
const { metaProperty } = require("@babel/types");

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
        data
    })
}



const getTransactions = (req, res) => {
    const Email = req.email

    return userModel.getUserByEmail(Email).then(response => {
        if (response.status == true) {
            const buzID = response.data.data.buzzID;
            transactionModel.getBuzmeRecord(buzID).then(response2 => {
                let list = [];
                for (let i = 0; i < response2.data.length; i++) {
                    const element = response2.data[i];
                    const newData = {
                        type: element.type,
                        data: element.meta.data,
                        sender: element.meta.sender,
                        receiver: element.meta.receiver,
                    }
                    list.push(element)
                }
                if (list.length > 0) {
                    success(res, list)
                } else {
                    error(res, list)
                } 
                // success(res, list)
            })
                .catch(error => {
                    error(res,"A network error occured")
                })
        } else {
            error(res, response.msg)
        }
    })
}

module.exports = {
    getTransactions
}