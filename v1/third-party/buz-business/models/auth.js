const { supabase } = require("../../../../config");

const LoginFetchUser_model = (email) => {
    return supabase
        .from("userMetadata")
        .select("data")
        .eq("email", email)
}

const Login_model = (data) => {
    const { email, password } = data;
    return supabase
        .auth
        .signIn({
            email: email,
            password: password,
        })
}

module.exports = {
    LoginFetchUser_model,
    Login_model
};