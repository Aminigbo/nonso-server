const { date } = require("../utilities/index")
const { isNum, validatePhoneNumber } = require("../utilities/index")
const { transactionModel } = require("../models/reansactions/cashbackModel")

// User model
const { userModel } = require("../models/users/user_models")
//  require SMS service
let { smsService } = require("../services/sms_service")

// email otp service
let { otpEmail } = require("../services/email_service/otp_email")


const error = (res, msg) => {
   res.send({
      success: false,
      message: msg,
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


function SendOTP(phone, message) {
   smsService(phone, message)
      .then((response) => {
         return true;
      })
      .catch((error) => {
         return false;
      });
}





const getAllUsersBuzme = (req, res) => {
   const { user } = req.body
   return transactionModel.getBuzmeRecord(user).then(response => {
      res.send(response)
   })
}

const requestBuzme = (req, res) => {
   const { sendTo, from, amount, reason } = req.body

   let sendToPhones = [];
   for (let i = 0; i < sendTo.length; i++) {
      sendToPhones.push(`+234${sendTo[i].buzid}`);
   }

   const message = `You have a Buz request of NGN ${parseInt(amount)} from ${from.name}. Desc: ${reason}. Ref: ${new Date().getTime()}`;

   SendOTP(sendToPhones, message)


   for (let i = 0; i < sendTo.length; i++) {
      let newPayload = {
         ...req.body,
         sender: from.buzzID,
         to: sendTo[i].buzid,
         data: {
            ref: new Date().getTime()
         },
         date: newDate(),
         type: "BUZ REQUEST"
      }

      return transactionModel.insertTransaction(newPayload).then(suc => {
         res.send(suc)
      })
         .catch(error => {
            console.log(error)
         })
   }




}


// sendBuzme
const sendBuzme = (req, res) => {
   const { senderbuzzID, receiverbuzzID, amount, desc } = req.body

   // get the object of who is sending
   return userModel.getUserByBuzID(senderbuzzID).then(responnse_3 => {
      if (responnse_3.status == false) return error(res, "Invalid sender")
      const senderOBJ = responnse_3.data;

      // check for insufficient walet balance
      if (parseInt(senderOBJ.wallet) < parseInt(amount)) return error(res, "Insufficient wallet balance")

      // get the object of who is receiving.
      return userModel.getUserByBuzID(receiverbuzzID).then(responnse_1 => {
         if (responnse_1.status == false) return error(res, "Invalid receiver")
         const receiverOBJ = responnse_1.data;



         // set receiver's new wallet
         const recNewWallet = parseInt(receiverOBJ.wallet) + parseInt(amount)

         // set sender's new wallet
         const senderNewWallet = parseInt(senderOBJ.wallet) - parseInt(amount)


         // get the object of who is sending.
         userModel.getUserByBuzID(senderbuzzID).then(responnse_2 => {
            // construct sender beneficiaries
            const senderBeneficiaries = responnse_2.data.data.beneficiaries // get the sender's beneficiaries

            // construct new beneficiary
            const newBeneficiary = {
               name: receiverOBJ.data.name,
               buzzID: receiverbuzzID
            }

            //senderBeneficiaries.push(newBeneficiary)  // push the constructed beneficiary to the existing beneficiaries.

            const newData = {
               ...responnse_2.data.data,
               beneficiaries: senderBeneficiaries
            }

            // construct object to deduct from who is sending
            const wallt_update_payload_for_user = {
               amount: senderNewWallet,
               data: newData, // updated beneficiaries
               email: req.email
            }

            // deduct from who is sending
            userModel.updateUserWallet_data(wallt_update_payload_for_user).then(response_3 => {
               if (response_3.status !== true) return error(res, "An error occured")
 

               // ======== credit the wallet of who is receiving 

               // receiver wallet payload
               const recWalletbj = {
                  amount: recNewWallet,
                  email: receiverOBJ.email
               }
               // console.log(recWalletbj)
               userModel.updateUserWallet(recWalletbj).then(response_4 => {


                  // create payload to save in the transaction history  
                  let newPayload = {
                     sender: senderbuzzID,
                     to: receiverbuzzID,
                     data: {
                        sender: {
                           fullname: senderOBJ.data.name,
                           buzzID: senderbuzzID,
                           phone: `+234${senderbuzzID}`,
                        },
                        receiver: {
                           fullname: receiverOBJ.data.name,
                           buzzID: receiverbuzzID,
                           phone: `+234${receiverbuzzID}`,
                        },

                        amount,
                        desc: desc,
                        ref: new Date().getTime()
                     },
                     date: newDate(),
                     type: "BUZ ALERT"
                  }

                  return transactionModel.insertTransaction(newPayload).then(suc => {

                     res.send({
                        success:true,
                        message:"Successfull",
                        sender:suc.data.meta.data.sender,
                        receiver:suc.data.meta.data.receiver,
                        data:{
                           amount:suc.data.meta.data.amount,
                           desc:suc.data.meta.data.desc,
                           ref:suc.data.meta.data.ref,
                           date:suc.data.meta.date
                        },
                        type:suc.data.type
                     })

                  })
                     .catch(error => {
                        console.log(error)
                     })
               })
                  .catch(error => {
                     // return error(res, "An error occured")
                     console.log(error)
                  })
            })
               .catch(error => {
                  res.send('error 1')
               })
         })



      })


   })
      .catch(error => {
         console.log(error)
         // error(res, error)
      })
}
module.exports = {
   getAllUsersBuzme,
   requestBuzme,
   sendBuzme
}