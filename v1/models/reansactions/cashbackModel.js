const { supabase } = require("../../../config/index");

const transactionModel = {
   insertToken: (payload) => {
      return supabase
         .from("kashback_token")
         .insert([
            {

               token: payload.data.data.token,
               data: payload.data,
               active: true,
               user: payload.data.sender.buzzID
            },
         ])
         .then((res) => {
            if (res.data.length > 0) {
               return {
                  status: true,
                  msg: "Successful",
                  data: res.data[0]
               };
            } else {
               return {
                  status: false
               };
            }

         })
         .catch((err) => {
            return {
               status: false,
               msg: "A network error occured"
            };
         });
   },
   verifyToken: (token) => {
      return supabase
         .from("kashback_token")
         .select('*')
         .eq("token", token)
         .then((res) => {
            if (res.data.length > 0) {
               if (res.data[0].active == false) {
                  return {
                     status: false,
                     msg: "Token already resolved",
                  };
               } else {
                  return {
                     status: true,
                     msg: null,
                     data: {
                        ...res.data[0]
                     }
                  };
               }

            } else {
               return {
                  status: false,
                  msg: "Invalid token"
               };
            }

         })
         .catch((err) => {
            return {
               status: false,
               msg: "A network error occured"
            };
         });
   },

   // get all user buzme records (Requested or sent)
   getBuzmeRecord: (user) => {
      return supabase
         .from("transactions")
         .select("*")
         .or(`from.eq.${user},to.eq.${user}`)
         .then((res) => {
            if (res.data.length > 0) {
               return {
                  status: true,
                  msg: null,
                  data: res.data
               };
            } else {
               return {
                  status: false,
                  msg: "No data found",
                  data:{}
               };
            }

         })
         .catch((err) => {
            return {
               status: false,
               msg: err
            };
         });
   },

   insertTransaction: (payload) => {
      return supabase
         .from("transactions")
         .insert([
            {
               from: payload.sender,
               to: payload.to,
               meta: payload,
               type: payload.type,
            },
         ])
         .then((res) => {
            if (res.data.length > 0) {
               return {
                  success: true,
                  message: "Successful",
                  data: res.data[0]
               };
            } else {
               return {
                  success: true,
                  message: "Error occured",
                  data: []
               };
            }

         })
         .catch((err) => {
            return {
               success: false,
               message: "A network error occured",
               data:[]
            };
         });
   },

   insertNotification: (payload) => {
      return supabase
         .from("notifications")
         .insert([
            {
               from: payload.from,
               to: payload.to,
               meta: payload,
               type: "Kashback",
            },
         ])
         .then((res) => {
            if (res.data.length > 0) {
               return {
                  status: true,
                  msg: null,
                  data: res.data[0]
               };
            } else {
               return {
                  status: false
               };
            }

         })
         .catch((err) => {
            return {
               status: false,
               msg: "A network error occured"
            };
         });
   },

   deactivateToken: (payload) => {
      return supabase
         .from("kashback_token")
         .update({
            active: false
         })
         .eq("token", payload)
         .then((res) => {
            if (res.data.length > 0) {
               return {
                  status: true,
                  msg: null,
                  data: res.data[0]
               };
            } else {
               return {
                  status: false
               };
            }

         })
         .catch((err) => {
            return {
               status: false,
               msg: "A network error occured"
            };
         });
   },

   getUsersToken: (user) => {
      return supabase
         .from("kashback_token")
         .select('*')
         .eq("user", user)
         .then((res) => {
            if (res.data.length > 0) {
               return {
                  status: true,
                  msg: "successful",
                  data: {
                     ...res.data
                  }
               };

            } else {
               return {
                  status: false,
                  msg: "No record found"
               };
            }

         })
         .catch((err) => {
            return {
               status: false,
               msg: "A network error occured"
            };
         });
   }



}


module.exports = {
   transactionModel
};
