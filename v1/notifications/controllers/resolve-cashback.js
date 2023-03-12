const md5 = require("md5")
let jwt = require("jsonwebtoken");
const Mailjet = require('node-mailjet');

// let { generateOTP, RefCode, sendOTP } = require("../utilities")

//  require SMS service
// let { smsService } = require("../services/sms_service")

// email otp service
// let { otpEmail } = require("../services/email_service/otp_email")

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


function Resolve_cashback(req, res) {
    const { tokenOwnerName,
        tokenOwnerEmail,
        tokenOwnerPhone,
        recieverName,
        receiverPhone,
        receiverEmail,
        tokenAmount,
        token,
        charge,
        date } = req.body;
    if (!tokenOwnerEmail) return res.send("Provide all parameters")

    // sms otp
    //   const message = `<#> Please use ${OTP} as your Buzpay registration code.  Do not share this OTP with anyone`; // message to be sent
    //   smsService(phone, message);

    const mailjet = Mailjet.apiConnect(
        "d1b9662210819a6ac7a531c76f484aa8",
        "d0aca19eb3115c7fd2a593455a762bae",
    );

    const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: "info@harvoxx.com",
                        Name: "Buzpay"
                    },
                    To: [
                        {
                            Email: tokenOwnerEmail,
                            Name: tokenOwnerName
                        }
                    ],
                    Subject: `Resolved Cash token - ₦${tokenAmount}`,
                    // TextPart: "",
                    HTMLPart: `<!DOCTYPE html>
                    <html lang="en">
                    
                    <head>
                      <meta charset="UTF-8" />
                      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"
                        integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA=="
                        crossorigin="anonymous" referrerpolicy="no-referrer" />
                      <title>Document</title>
                      <style>
                        @media only screen and (min-width: 800px) {
                          * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                            outline: none;
                          }
                    
                          body {
                            width: 100%;
                            height: auto;
                            display: flex;
                            justify-content: center;
                            background-color: #f3f3f3;
                            padding: 15px
                          }
                    
                          .email-container {
                            width: 50%;
                            /* background-color: #90b3cd; */
                            /* height: auto; */
                            padding-bottom: 30px;
                            /* height: 580px; */
                            margin-left: 25%;
                            position: relative
                          }
                    
                          .navigation-bar {
                            padding: 5px 20px 5px 20px;
                            margin-bottom: 10px;
                          }
                    
                          .landing-img {
                            width: 100%;
                            height: auto;
                            display: flex;
                            justify-content: center;
                          }
                    
                          .img {
                            width: auto;
                            height: 200px;
                          }
                    
                          .img-holder {
                            width: 100%;
                            height: auto;
                            padding: 0 20px;
                            display: flex;
                            flex-flow: row wrap;
                            justify-content: space-between;
                            margin: 30px 0;
                          }
                    
                          .btn {
                            padding: 10px 30px;
                            border-radius: 100px;
                            border: none;
                            font-size: 19px;
                            background-color: #124ac3;
                            color: #fff;
                          }
                    
                          .footer {
                            width: 100%;
                            height: auto;
                            display: flex;
                            flex-flow: row wrap;
                            background: linear-gradient(to bottom right, black, #124ac3);
                            /* position:absolute; */
                            /* bottom: 0px;
                                                    left:32.5%; */
                          }
                    
                          .logo-cont {
                            width: 100%;
                            padding: 0 20px;
                          }
                    
                          .first-column {
                            width: 30%;
                            margin-right: 5%;
                            padding: 0 20px;
                            font-family: sans-serif;
                            color: #fff
                          }
                    
                          .second-column {
                            width: 30%;
                            padding: 0 20px;
                            font-family: sans-serif;
                            color: #fff
                          }
                    
                          body {
                            margin-top: 40px
                          }
                    
                          .label {
                            height: 10px;
                            background: linear-gradient(to bottom right, black, #124ac3);
                            margin-bottom: 30px
                          }
                        }
                    
                    
                    
                    
                    
                    
                        @media only screen and (max-width: 800px) {
                          body {
                            background-color: #f3f3f3;
                          }
                    
                          * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                            outline: none;
                          }
                    
                          body {
                            width: 100%;
                            height: auto;
                            display: flex;
                            justify-content: center;
                          }
                    
                          .email-container {
                            width: 100%;
                            max-width: 100%;
                            /* background-color: #90b3cd; */
                            height: auto;
                            padding-bottom: 30px;
                          }
                    
                          .navigation-bar {
                            padding: 5px 10px 5px 10px;
                            margin-bottom: 10px;
                          }
                    
                          .landing-img {
                            width: 100%;
                            height: auto;
                            display: flex;
                            justify-content: center;
                          }
                    
                          .img {
                            width: auto;
                            height: 100px;
                          }
                    
                          .img-holder {
                            width: 100%;
                            height: auto;
                            padding: 0 20px;
                            display: flex;
                            flex-flow: row wrap;
                            justify-content: center;
                            margin: 30px 0;
                          }
                    
                          .btn {
                            padding: 10px 30px;
                            border-radius: 100px;
                            border: none;
                            font-size: 19px;
                            background-color: #124ac3;
                            color: #fff;
                          }
                    
                          .footer {
                            width: 100%;
                            height: auto;
                            display: flex;
                            flex-flow: row wrap;
                            background: linear-gradient(to bottom right, black, #124ac3);
                            position: absolute;
                            bottom: 0px;
                            left: 0px;
                          }
                    
                          .logo-cont {
                            width: 100%;
                            padding: 0 20px;
                          }
                    
                          .first-column {
                            width: 100%;
                            margin-bottom: 20%;
                            padding: 0 20px;
                            font-family: sans-serif;
                            color: #fff
                          }
                    
                          .second-column {
                            width: 100%;
                            padding: 0 20px;
                            font-family: sans-serif;
                            color: #fff
                          }
                    
                          .label {
                            height: 10px;
                            background: linear-gradient(to bottom right, black, #124ac3);
                            margin-bottom: 30px
                          }
                        }
                    
                        p {
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
                        }
                      </style>
                    </head>
                    
                    <body style='background-color:#f4f6f8'>
                      <section class="email-container" style='font-family: Open Sans,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,Helvetica,Arial,sans-serif;
                                            padding: 0px 0px;'>
                        <div style="text-align: left;background-color: ;padding: 10px;">
                          <img src="https://buzpayapp.com/logo/logo.png" style="margin:auto;width:100px" />
                        </div>
                        <!-- #90b3cd -->
                    
                        <div style="background-color: #90b3cd;padding: 10px 30px;">
                          <div class="" style="padding:; font-family: sans-serif">
                    
                            <!-- <h2 style='color:#0a3d62'>Buzz pay</h2>
                                                <br />  -->
                            <p
                              style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:1.4em;">
                              <b>Resolved Cash Token</b>
                            </p>
                          </div>
                    
                          <div class="" style="padding: ; font-family: sans-serif">
                            <br />
                            <br />
                            <p
                              style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;">
                              Hi ${tokenOwnerName}, Your cash token of ₦${tokenAmount}.00 has been resolved successfully.
                            </p>
                          </div> <br>
                        </div>
                    
                        <div style="color: #9eb0b7;background-color:#f4f6f8; padding:10px;font-family: Open Sans,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,Helvetica,Arial,sans-serif;font-size: 13px;
                                            font-weight: 300; ">
                          <br> 
                          <div style="margin: 10px 0px;">
                            Amount: <div style="display: inline-block;width: 70%;text-align: left;float: right" ><b style="float: ;">₦${tokenAmount}</b></div>
                          </div>
                          <div style="margin: 10px 0px;">
                            Name of Recipient: <div style="display: inline-block;width: 70%;text-align: left;float: right" ><b style="float: ;">${recieverName}</b></div>
                          </div>
                          <!-- <div style="margin: 10px 0px;">
                            Bank of Recipient: <div style="display: inline-block;width: 70%;text-align: left;float: right" ><b style="float: ;">Access Bank</b></div>
                          </div> -->
                          <div style="margin: 10px 0px;">
                            Date: <div style="display: inline-block;width: 70%;text-align: left;float: right" ><b style="float: ;">${date}</b></div>
                          </div>  
                        </div> <br>
                    
                    
                        <div style="background-color: #90b3cd;padding: 10px 30px;">
                          <p style="font-size:0.9em;color:#00466a">Regards,<br /> <b>BuzPay Team</b> </p> <br>
                          <!-- <hr style="border:none;border-top:1px solid #eee" /> -->
                          <div style="position: ;bottom:2.5%;width:100%; color: #f4f6f8;background-color:; padding:15px;font-family: Open Sans,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,Helvetica,Arial,sans-serif;font-size: 13px;
                          font-weight: 300;text-align:center ">
                    
                            © BuzPay 2022 <br> <br>
                            12,Elzazi plaza, Woji port Harcourt, Nigeria
                          </div>
                    
                        </div>
                    
                      </section>
                    </body>
                    
                    </html>`
                }
            ]
        })

    request
        .then((result) => {
            return res.send(true)
        })
        .catch((err) => {
            return res.send(false)
        })

}



module.exports = {
    Resolve_cashback
}
