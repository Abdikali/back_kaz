const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const userSchema = new Schema({
  id: String,
  name: String,
  surename: String,
  age: Number
});

const User = model("User", userSchema);

module.exports = User;
