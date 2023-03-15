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
            status: false,
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
async function InserUserMetadataXXX(data) {
   return supabase
      .from("data")
      .update([
         {
            table: data,
         },
      ])
      .eq('level', '300')
      .then((res) => { 
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
