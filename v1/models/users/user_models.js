const { supabase } = require("../../../config/index");

const userModel = {
   getAllUser: () => {
      return supabase
         .from("userMetadata")
         .select("*")
         .then((res) => {
            if (res.data.length > 0) {
               return {
                  status: true,
                  msg: null,
                  data: res.data
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
   getUserByBuzID: (buzID) => {
      return supabase
         .from("userMetadata")
         .select("*")
         .eq("buzzID", buzID)
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
   getUserByEmail: (email) => {
      return supabase
         .from("userMetadata")
         .select("*")
         .eq("email", email)
         .then((res) => {
            if (res.data.length > 0) {
               return {
                  status: true,
                  msg: null,
                  data: res.data[0]
               };
            } else {
               return {
                  status: false,
                  msg: "Invalid user"
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
   updateUserWallet_data: (payload) => {
      return supabase
         .from("userMetadata")
         .update({
            wallet: payload.amount,
            data: payload.data
         })
         .eq("email", payload.email)
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
               status: false,
               msg: "A network error occured1"
            };
         });
   },
   updateUserWallet: (payload) => {
      return supabase
         .from("userMetadata")
         .update({
            wallet: payload.amount
         })
         .eq("email", payload.email)
         .then((res) => {
            // console.log(res)
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
               status: false,
               msg: "A network error occured1"
            };
         });
   },
   getUserWallet: (email) => {
      return supabase
         .from("userMetadata")
         .select("wallet, buzzID, data")
         .eq("email", email)
         .then((res) => {
            if (res.data.length > 0) {
               return {
                  wallet: res.data[0].wallet,
                  buzID: res.data[0].buzzID,
                  name: res.data[0].data.name
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
   }

}


module.exports = {
   userModel
};
