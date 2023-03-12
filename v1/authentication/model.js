const { supabase } = require("../../config/index");


// =====   check if phone number already exists
async function phoneTaken(payload) {
   return supabase
      .from("userMetadata")
      .select("phone")
      .eq("phone", payload)
      .then((res) => {
         if (res.data.length > 0) {
            return {
               status: true,
               msg: null,
               data: res
            };
         } else {
            return {
               status: false
            };
         }

      })
      .catch((err) => {
         return {
            status: true,
            msg: err
         };
      });
}


// !+============   signin user
async function signInUser(payload) {
   return supabase.auth
      .signUp(
         {
            email: payload.email,
            password: payload.password,
         },
         {
            data: payload.meta
         }
      )
      .then((res) => {
         if (res.error != null) {
            return {
               success: true,
               // msg: res.error.message
               msg: res
            };
         } else {
            return {
               success: true,
               data: {
                  ...res.user,
                  token: res.session.access_token
               }
            };
         }

      })
      .catch((err) => {
         return {
            success: false,
            msg: err
         };
      });
}


// !==========================  INSERT USER METADATA
async function InserUserMetadata(payload) {
   return supabase
      .from("user")
      .insert([
         {
            email: payload.email,
            password: payload.password,
            data: payload,
         },
      ])
      .then((res) => {
         console.log(res)
         if (res.data.length > 0) {
            return {
               success: true,
               data: res.data[0]
            };
         } else {
            return {
               success: false,
               msg: res

            };
         }

      })
      .catch((err) => {
         console.log(err)
         return {
            success: false,
            msg: err
         };
      });
}


////////////////////////  UPDATE METADATE PASSWORD
const updateMetadataPassword = (payload) => {
   return supabase
      .from("userMetadata")
      .update([
         {
            data: { meta: payload.data },
         },
      ])
      .eq("email", payload.email)
      .then((res) => {
         if (res.data.length > 0) {
            return {
               success: true,
            };
         } else {
            return {
               success: false,
            };
         }
      })
      .catch((err) => {
         return {
            success: false,
         };
      });
}


// !+============   signin user
async function LoginUser(payload) {
   return supabase.auth
      .signIn(
         {
            email: payload.email,
            password: payload.password,
         }
      )
      .then((res) => {
         if (res.error != null) {
            return {
               success: false,
               msg: res.error.message
            };
         } else {
            return {
               success: true,
               data: {
                  ...res.user,
                  token: res
               }
            };
         }

      })
      .catch((err) => {
         return {
            success: false,
            msg: err
         };
      });
}


// =====   Get user's metadata
async function getMetadata(payload) {
   return supabase
      .from("user")
      .select("*")
      .eq("email", payload)
      .then((res) => {
         if (res.data.length > 0) {
            return {
               status: true,
               msg: null,
               data: res
            };
         } else {
            return {
               status: false
            };
         }

      })
      .catch((err) => {
         return {
            status: true,
            msg: err
         };
      });
}

// =====   Get user's metadata
async function getCourses(level) {
   return supabase
      .from("data")
      .select("*")
      .eq("level", level)
      .then((res) => { 
         if (res.data.length > 0) {
            return {
               status: true,
               msg: null,
               data: res
            };
         } else {
            return {
               status: false,
               data: res
            };
         }

         
      })
      .catch((err) => {
         console.log(err);
         return {
            status: falsee,
            msg: err
         };

      });
}


// =====   UPDATE PASSWORD
async function resetPwd(payload) {
   return supabase
      .auth.update(
         {
            email: payload.email,
            password: payload.password,
         }
      )
      .then((res) => {
         if (res.error != null) {
            return {
               success: false,
               msg: res.error.message
            };
         } else {
            // return {
            //    success: true,
            //    data: {
            //       metadata:res.data.user_metadata
            //    }
            // };

            return LoginUser(payload)
         }

      })
      .catch((err) => {
         return {
            success: false,
            msg: err
         };
      });
}


async function activateUser(email) {
   return supabase
      .from("userMetadata")
      .update([
         {
            active: true,
         },
      ])
      .eq("email", email)
      .then((res) => {
         if (res.data.length > 0) {
            return {
               success: true,
            };
         } else {
            return {
               success: false,
            };
         }
      })
      .catch((err) => {
         return {
            success: false,
         };
      });
}



// !==========================  INSERT USER METADATA
async function InserUserMetadataXXX(payload) {
   return supabase
      .from("data")
      .insert([
         {
            dpt: "Computer Science",
            level: '200',
            courses: [
               {
                  course: "Citizenship Orientation",
                  code: "GEDS 001,002",
                  unit: {
                     first: "0",
                     second: "0"
                  }
               },
               {
                  course: "Biblical Principles in Personal and Professional Life",
                  code: "GEDS 420",
                  unit: {
                     first: "-",
                     second: "3"
                  }
               },
               {
                  course: "Compiler Construction",
                  code: "COSC 401 ",
                  unit: {
                     first: "3",
                     second: "-"
                  }
               },
               {
                  course: "Information Theory and Data Communication Systems",
                  code: "COSC 402",
                  unit: {
                     first: "-",
                     second: "3"
                  }
               },
               {
                  course: "Artificial Intelligence and Applications",
                  code: "COSC 423",
                  unit: {
                     first: "3",
                     second: "-"
                  }
               },
               {
                  course: "Database System Design, Implementation and Management",
                  code: "COSC 333",
                  unit: {
                     first: "3",
                     second: "-"
                  }
               },
               {
                  course: "Computer Organization and Architecture",
                  code: "COSC 425",
                  unit: {
                     first: "3",
                     second: "-"
                  }
               },
               {
                  course: "Object-Oriented Programming Techniques",
                  code: "COSC 424",
                  unit: {
                     first: "-",
                     second: "3"
                  }
               },
               {
                  course: "Web Design and Development",
                  code: "ITGY 401",
                  unit: {
                     first: "-",
                     second: "3"
                  }
               },
               {
                  course: "Research Project",
                  code: "COSC 490",
                  unit: {
                     first: "-",
                     second: "6"
                  }
               },
               {
                  course: "Principles of Software Engineering ",
                  code: "SENG 400",
                  unit: {
                     first: "3",
                     second: "-"
                  }
               },
               {
                  course: "Internet Technologies and Web Application Development",
                  code: "SENG 412 ",
                  unit: {
                     first: "-",
                     second: "3"
                  }
               },
               {
                  course: "Modelling and Simulations",
                  code: "*COSC 408",
                  unit: {
                     first: "-",
                     second: "3"
                  }
               },
               {
                  course: "Cyber Law, Crime, Forensics and Auditing",
                  code: "ITGY 410",
                  unit: {
                     first: "3",
                     second: "-"
                  }
               },
               {
                  course: "Reverse Engineering and Malware Analysis",
                  code: "ITGY 400",
                  unit: {
                     first: "2",
                     second: "-"
                  }
               },
               {
                  course: "Machine Learning with Python",
                  code: "*COSC 427",
                  unit: {
                     first: "3",
                     second: "-"
                  }
               },
               {
                  course: "Database Admin Workshop",
                  code: "COSC 409",
                  unit: {
                     first: "1",
                     second: "-"
                  }
               }
               , {
                  course: "Hands on Java Training",
                  code: "COSC 430",
                  unit: {
                     first: "-",
                     second: "1"
                  }
               }

            ],
         },
      ])
      .then((res) => {
         console.log(res)
         if (res.data.length > 0) {
            return {
               success: true,
               data: res.data[0]
            };
         } else {
            return {
               success: false,
               msg: res

            };
         }

      })
      .catch((err) => {
         console.log(err)
         return {
            success: false,
            msg: err
         };
      });
}


module.exports = {
   InserUserMetadataXXX,
   phoneTaken,
   signInUser,
   InserUserMetadata,
   updateMetadataPassword,
   LoginUser,
   activateUser,
   getMetadata, 
   getCourses
};
