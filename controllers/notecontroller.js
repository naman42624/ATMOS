// const User = require("../models/user");

//
// async function getUserDetails (req,res){
//     let token = req.cookies.jwt;
//
//     if(token) {
//         const userDetails = await jwt.verify(token, 'ATMOS', async (err, decodedToken) => {
//             if(err){
//                 console.log(err.message);
//                 return 1;
//             }
//             else{
//                 // console.log(decodedToken);
//                 let user = await User.findById(decodedToken.id);
//                 // console.log("from getUserDetails: ")
//                 // console.log(user);
//                 return user;
//             }
//         })
//         return userDetails;
//     }
//     else{
//         return 1;
//     }
//
//
// }


module.exports.post_notes_data = async (req,res) => {

  // const user = getUserDetails(req,res);
  const noteNumber = req.params.noteID;
  const title = req.body.title;
  const desc = req.body.desc;

  const note = await Note.create({title,desc});

  res.json("/notes");

}

module.exports.get_notes = (req,res) => {
  res.render('notes-index');
}
