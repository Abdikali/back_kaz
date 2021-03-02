const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const taskSchema = new Schema({
  description: {
    type: String,
    minlength: 10,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}, {timestamps: true});

const Task = model("Task", taskSchema);

module.exports = Task;
