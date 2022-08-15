// const generateMessage = (text) => {
//   return {
//     text,
//     createdAt: new Date().getTime()
//   };
// }
const generateMessage = (data) => {
  return {
    text: data.msg,
    username: data.user,
    createdAt: new Date().getTime()
  };
}
module.exports = { generateMessage};

// const generateLocationMessage = (url) => {
//   return {
//     url,
//     createdAt: new Date().getTime()
//   };
// }