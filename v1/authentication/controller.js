const md5 = require("md5")
let jwt = require("jsonwebtoken");
const Mailjet = require('node-mailjet');
const { userModel } = require("../models/users/user_models")
let { validateEmail, validate__pwd, } = require("./utilities")
let { InserUserMetadata, LoginUser, getMetadata, getCourses, InserUserMetadataXXX } = require("./model")



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
   const timetable = [
      {
          day: "monday",
          one: {
              course: "",
              free: true
          },
          two: {
              course: "",
              free: true
          },
          three: {
              course: "CHAPEL SEMINAR",
              free: false
          },
          four: {
              course: "COSC 306 GRP C BUCODEL  LAB 3 ",
              free: false
          },
          five: {
              course: "GEDS 312 ",
              free: false
          },
          six: {
              course: "GEDS 312 ",
              free: false
          },
          seven: {
              course: "",
              free: true
          },
          eight: {
              course: "COSC 328 CS D NEW  HORIZONS",
              free: false
          },
          nine: {
              course: "COSC 328 CS D NEW  HORIZONS",
              free: false
          },
          ten: {
              course: "COSC 312 CITe",
              free: false
          },
          eleven: {
              course: "COSC 312 CITe",
              free: false
          }
      },
      {
          day: "Tues",
          one: {
              course: "",
              free: true
          },
          two: {
              course: "",
              free: true
          },
          three: {
              course: "COSC 302 BUCODEL LAB 4 ",
              free: false
          },
          four: {
              course: "COSC 302 BUCODEL LAB 4",
              free: false
          },
          five: {
              course: "GEDS 312",
              free: false
          },
          six: {
              course: "GEDS 312",
              free: false
          },
          seven: {
              course: "",
              free: true
          },
          eight: {
              course: "COSC 306 GRP C BUCODEL  LAB 5",
              free: false
          },
          nine: {
              course: "COSC 306 GRP C BUCODEL  LAB 5",
              free: false
          },
          ten: {
              course: "COSC 306 GRP D CIT",
              free: false
          },
          eleven: {
              course: "COSC 306 GRP D CIT",
              free: false
          }
      },
      {
          day: "Wed",
          one: {
              course: "",
              free: true
          },
          two: {
              course: "",
              free: true
          },
          three: {
              course: "COSC 302 BUCODEL LAB 3 ",
              free: false
          },
          four: {
              course: "COSC 302 BUCODEL LAB 3 ",
              free: false
          },
          five: {
              course: "COSC 302 BUCODEL LAB 5",
              free: false
          },
          six: {
              course: "COSC 302 BUCODEL LAB 5",
              free: false
          },
          seven: {
              course: "",
              free: true
          },
          eight: {
              course: "COSC 328 GRP C NEW  HORIZONS ",
              free: false
          },
          nine: {
              course: "COSC 328 GRP C NEW  HORIZONS ",
              free: false
          },
          ten: {
              course: "COSC 306 GRP D CIT",
              free: false
          },
          eleven: {
              course: "COSC 306 GRP D CIT",
              free: false
          }
      },
      {
          day: "Thur",
          one: {
              course: "",
              free: true
          },
          two: {
              course: "",
              free: true
          },
          three: {
              course: "COSC 312 CIT",
              free: false
          },
          four: {
              course: "COSC 312 CIT",
              free: false
          },
          five: {
              course: "COSC 312 BUCODEL LAB 4",
              free: false
          },
          six: {
              course: "COSC 312 BUCODEL LAB 4",
              free: false
          },
          seven: {
              course: "",
              free: true
          },
          eight: {
              course: "",
              free: true
          },
          nine: {
              course: "",
              free: true
          },
          ten: {
              course: "COSC 306 GRP D CIT",
              free: false
          },
          eleven: {
              course: "COSC 306 GRP D CIT",
              free: false
          }
      },
      {
          day: "Fri",
          one: {
              course: "COSC 401 CIT",
              free: false
          },
          two: {
              course: "COSC 401 CIT",
              free: false
          },
          three: {
              course: "COSC 425 BUCODEL LAB 3 ",
              free: false
          },
          four: {
              course: "COSC 425 BUCODEL LAB 3",
              free: false
          },
          five: {
              course: "COSC 333 BUCODEL  LAB 5",
              free: false
          },
          six: {
              course: "COSC 425 BUCODEL  LAB 3 ",
              free: false
          },
          seven: {
              course: "",
              free: true
          },
          eight: {
              course: "",
              free: true
          },
          nine: {
              course: "",
              free: true
          },
          ten: {
              course: "",
              free: true
          },
          eleven: {
              course: "",
              free: true
          }
      },
  ]
   // InserUserMetadataXXX(timetable)
   return getCourses(req.body.level).then(result2 => {  

      success(res, result2.data.data[0] )
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
