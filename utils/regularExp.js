/* const isUrl =
/^(https?:\/\/)(www\.)
?[-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=]+\.[-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=]+#?$/; */
const isUrl = /(http|https):\/\/[a-zA-Z0-9\-./_]+/;
module.exports = { isUrl };
