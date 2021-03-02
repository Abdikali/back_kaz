const express = require('express');
const Task = require("../models/task.model");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  try{
    const task = await new Task({
      ...req.body,
      owner: req.user._id
    }).save();
    res.status(201).json({error: false, task});
  }catch(e){
    const {message} = e;
    res.status(403).json({error: true, message});
  }
});

router.get("/", auth, async (req, res) => {
  const match = {};
  const sort = {}
  if(req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  if(req.query.sortBy){
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    console.log(sort);
  }
  try{
    await req.user.populate({
      path: "tasks",
      match,
      options:{
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      }
    }).execPopulate();
    res.status(200).json({error: false, tasks: req.user.tasks});
  }catch(e){
    const {message} = e;
    res.status(403).json({error: true, message});
  }
});

router.get("/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try{
    const task = await Task.findOne({_id, owner: req.user._id});
    if(!task) return res.status(404).json({error: true, message: "Task was not found"});
    res.status(200).json({error: false, task});
  }catch(e){
    const {message} = e;
    res.status(500).json({error: true, message});
  }
})

router.put("/:id", auth, async(req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every(item => allowedUpdates.includes(item));
  if(!isValidOperation){
    res.status(400).json({error: true, message: "validation failed"});
  }
  try{
    const task = await Task.findOne({_id, owner: req.user._id })
    console.log(task);
    if(!task){
      return res.status(404).json({error: true, message: "No task was found"});
    }
    updates.forEach(item => task[item] = req.body[item]);
    await task.save();
    res.status(200).json({error: false, task});
  }catch(e){
    const {message} = e;
    res.status(500).json({error: true, message});
  }
});

router.delete("/:id", auth, async(req, res) => {
  const _id = req.params.id;
  try{
    const task = await Task.findOneAndDelete({_id, owner: req.user._id});
    if(!task) return res.status(404).json({error: false, message: "Task was not found"});
    res.status(200).json({error: false, task});
  }catch(e){
    const {message} = e;
    res.status(500).json({error: true, message});
  }
});

module.exports = router;
