const jwt = require('jsonwebtoken');
const User = require("../models/user.model");


const auth = async (req, res, next) => {
  try{
    const token = req.headers.authorization.replace("Bearer ", "");
    const decode = jwt.verify(token, "back_kaz");
    const user = await User.findOne({_id: decode._id, 'tokens.token': token});

    if(!user) throw new Error("User is not verified");

    req.token = token;
    req.user = user;
    next();
  }catch(e){
    res.status(401).json({error: true, message: "Please authenticate"});
  }
}

module.exports = auth;
