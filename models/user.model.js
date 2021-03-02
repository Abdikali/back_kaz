const mongoose = require('mongoose');
const Task = require("./task.model");
const {Schema, model} = mongoose;
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: 6,
    validate: {
      validator: password => !password.toLowerCase().includes("password")
    }
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: {
      validator: email => validator.isEmail(email)
    }
  },
  age: {
    type: Number,
    required: true,
    validate:{
      validator: age => age > 18, message: "Should be older than 18"
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: Buffer
}, {
  timestamps: true
});

userSchema.methods.generateAuthToken = async function(){
  const token = jwt.sign({_id: this._id.toString()}, "back_kaz");
  this.tokens = this.tokens.concat({token});
  await this.save();
  return token;
}


userSchema.virtual('tasks', {
  ref: "Task",
  localField: '_id',
  foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  delete user.avatar;
  return user;
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({email});
  if(!user) throw new Error("Unable to login");
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch) throw new Error("Unable to login");

  return user;
}

userSchema.pre("save", async function(next){
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 8)
  }
  next();
});

userSchema.pre("remove", async function(next){
  await Task.deleteMany({owner: this._id})
  next();
})

const User = model("User", userSchema);

module.exports = User;
