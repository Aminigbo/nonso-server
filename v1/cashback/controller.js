const { date } = require("../utilities/index")
const { cashbackRegEx } = require("./utilities")
const { userModel } = require("../models/users/user_models")
const { transactionModel } = require("../models/reansactions/cashbackModel")

const error = (res, msg) => {
   res.send({
      success: false,
      message: msg,
      data: {}
   })
}

const newDate = () => {
   return {
      day: date.day(),
      month: date.month(),
      year: date.year(),
      date: new Date().getDate(),
      time: date.time()
   }
}


const create_cashback = (req, res) => {
   if (!req.body.amount || !req.body.cashbackCharge || !req.body.systemCharge) return res.send("Provide request body")
   const { amount, cashbackCharge, systemCharge } = req.body
   const token = cashbackRegEx(req.token);

   const payload = {
      amount,
      amountPlusCharge: amount + cashbackCharge + systemCharge,
      adminTakes: systemCharge,
      User: req.email,
      charge: cashbackCharge,
      token,
      date,
   }



   // get user by email
   return userModel.getUserByEmail(req.email).then(response => {
      if (response.status !== true) return error(res, response.msg)
      // res.send(response)
      const userWalletBalance = response.data.wallet;  // user wallet from database 

      // update user wallet payload
      const userNewWallet = parseInt(userWalletBalance) - parseInt(payload.amountPlusCharge)
      const newPayload = {
         amount: parseInt(userNewWallet),
         email: req.email,
      }

      // check if token amount is less than limit
      if (payload.amountPlusCharge > 200000) return res.send({ success: false, messagge: "Maximum amount exceeded", data: [] })

      // check for insufficient wallet balance
      if (parseInt(userWalletBalance) < parseInt(payload.amountPlusCharge)) return res.send({ success: false, messagge: "Insufficient wallet balance", data: [] })

      // update user wallet with the new wallet balance
      userModel.updateUserWallet(newPayload).then(response2 => {
         if (response2.status !== true) return error(res, response2.msg)

         // insert into transaction payload
         const insertPayload = {
            buzzID: response.data.buzzID,
            data: {
               sender: {
                  fullname: response.data.name,
                  buzzID: response.data.buzzID,
                  phone: `+234${response.data.buzzID}`,
               },
               receiver: {
                  fullname: '',
                  buzzID: "",
                  phone: "",
               },
               data: {
                  amount: payload.amount,
                  amountPlusCharge: payload.amountPlusCharge,
                  charge: payload.charge,
                  ref: new Date().getTime(),
                  token,
                  date: newDate(),
                  adminCharge: payload.adminTakes
               },
               date: {
                  day: date.day(),
                  month: date.month(),
                  year: date.year(),
                  date: new Date().getDate(),
                  time: date.time()
               }
            }
         }
         transactionModel.insertToken(insertPayload).then(response3 => {
            if (response3.status !== true) return error(res, response3.msg)
            res.send({
               success: true,
               message: "Successful",
               data: {
                  token_data: {
                     ...response3.data.data.data,
                     token_status: true,
                  },
                  sender: {
                     ...response3.data.data.sender,
                     email: req.email,
                     newWallet: userNewWallet
                  },
                  receiver: response3.data.data.receiver
               }


            })
         })
      })
   })



}

const verifyCashbackToken = (req, res) => {
   const { token } = req.body
   return transactionModel.verifyToken(token).then(response => {
      if (response.status == false) return error(res, response.msg)
      res.send({
         success: true,
         message: "Successful",
         data: {
            token_data: {
               ...response.data.data.data,
               token_status: response.data.active,
               date: response.data.data.date
            },
            sender: response.data.data.sender,
            receiver: response.data.data.receiver
         }
      })
   })
}


const resolveToken = (req, res) => {
   const { token } = req.body

   return transactionModel.verifyToken(token).then(response => {
      if (response.status !== true) {
         error(res, "Invalid token")
      } else {
         let cashbackamount = response.data.data.data.amount;
         let vendorTakes = parseInt(cashbackamount) + parseInt(response.data.data.data.adminCharge)  // what vendor takes, which is amount + charge
         let AdminTakes = response.data.data.data.charge
         let sender = {
            phone: response.data.data.sender.phone,
            buzzID: response.data.data.sender.buzzID
         };



         // get wallet of who is reveiving
         userModel.getUserWallet(req.email).then(receiverWallet => {
            if (response.status !== true) return error(res, "An error occured")

            // receiver's new wallet
            const receiverNewWallet = parseInt(vendorTakes) + parseInt(receiverWallet.wallet)


            // update receiver's wallet
            const updatepayload = {
               amount: receiverNewWallet,
               email: req.email
            }

            // update the wallet of who is resolving the cashback
            userModel.updateUserWallet(updatepayload).then(updatedWallet => {
               if (response.status !== true) return error(res, "An error occured")


               // transaction  payload
               const transactionPayload = {
                  from: sender.buzzID,
                  to: receiverWallet.buzID,
                  sender: sender.buzzID,
                  meta: {
                     ...response.data.data,
                     receiver: {
                        phone: "+234" + receiverWallet.buzID,
                        buzzID: receiverWallet.buzID,
                        fullname: receiverWallet.name,

                     }
                  },
                  type: "Kashback"
               }
               // insert transaction
               transactionModel.insertTransaction(transactionPayload).then(insertedTransaction => {
                  if (response.status !== true) return error(res, "An error occured")


                  // notification payload
                  const notificationPayload = {
                     from: sender.buzzID,
                     to: receiverWallet.buzID,
                     meta: {
                        ...response.data.data,
                        receiver: {
                           phone: "+234" + receiverWallet.buzID,
                           buzzID: receiverWallet.buzID,
                           fullname: receiverWallet.name,
                        }
                     },
                     type: "Kashback"
                  }
                  // insert notification
                  transactionModel.insertNotification(notificationPayload).then(insertedNotification => {
                     if (response.status !== true) return error(res, "An error occured")


                     // deactivate token
                     transactionModel.deactivateToken(token).then(deactivatedToken => {
                        if (response.status !== true) return error(res, "An error occured")

                        res.send({
                           success: true, 
                           message: "Successful",
                           data: {
                              token_data: {
                                 ...insertedTransaction.data.meta.meta.data
                              },
                              sender: insertedTransaction.data.meta.meta.sender,
                              receiver: {
                                 ...insertedTransaction.data.meta.meta.receiver,
                                 newWallet: receiverNewWallet
                              }
                           }

                        })

                     })
                  })
               })
            })

         }

         )
      }
   })
}

const getAllUsersCashback = (req, res) => {
   return transactionModel.getUsersToken(req.body.buzID).then(response => {
      res.send(response)
   })
}


module.exports = {
   create_cashback,
   verifyCashbackToken,
   resolveToken,
   getAllUsersCashback

}