const md5 = require("md5")
let jwt = require("jsonwebtoken");
const Mailjet = require('node-mailjet');
const { userModel } = require("../models/users/user_models")
let { validateEmail, validate__pwd, } = require("./utilities")
let { InserUserMetadata, LoginUser, getMetadata, getCourses } = require("./model")



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
      data: data
   })
}



//======  sign in function 

const signin = (req, res) => {
   const { email, password } = req.body;
   // check email format
   if (validateEmail(email) == false) {
      error(res, "Invalid email format.")
   } else {
      let loginPayload = {
         email: email,
         password: password,
      }

      return getMetadata(email).then(result2 => {
         if (result2.status == false) return error(res, "Incorrect login details")

         const token = jwt.sign({
            email: email,
         }, process.env.supabaseSecrete, { expiresIn: '24h' });

         success(res, {
            ...result2.data.data[0].data,
            token,
         })
      })

   }
}


const Courses = (req, res) => {
   return getCourses(req.body.level).then(result2 => {  

      success(res, result2.data.data[0].courses )
   })
}


//=========  sign up function 

const signup = (req, res) => {
   const { name, faculty, department, email, password, level } = req.body

   // check email format
   if (validateEmail(email) == false) {
      error(res, "Invalid email format.")
   }
   // valid user password
   else if (validate__pwd(password) == false) {
      error(res, "Choose a strong password")
   }
   // all conditions met
   else {

      let metaData = {
         name: name,
         email: email,
         password: password,
         faculty: faculty,
         department: department,
         level: level,
      }
      // query the usermetadata table to check if the phone is already registered 

      getMetadata(email).then(result2 => {
         if (result2.status == false) {
            InserUserMetadata(metaData).then(updateMetaRes => {

               if (updateMetaRes.success == true) {
                  const token = jwt.sign({
                     email: email,
                  }, process.env.supabaseSecrete, { expiresIn: '24h' });

                  success(res, {
                     token,
                     data: updateMetaRes.data.data
                  })

               } else {
                  error(res, updateMetaRes.msg)
                  // res.send(updateMetaRes)
               }
            })
         } else {
            error(res, "Account already exists")
         }



      })

   }
}



module.exports = {
   signin,
   signup,
   Courses

}
