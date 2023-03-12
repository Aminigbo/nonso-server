const md5 = require("md5")
// @======== GENERATE CODES FOR CASHBACK
function cashbackRegEx(token) {
  return md5(new Date().getTime())
    .replace(/[^0-9]/g, "")
    .substr(0, 6);
}

module.exports = {
   cashbackRegEx
}