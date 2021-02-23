const User = require("../models/user.model");

exports.create = async (req, res) => {
  try{
    const user = await User.create(req.body);
    res.status(201).send({error: false, user});
  }catch(e){
    const {message} = e
    res.status(500).send({error: true, message});
  }
}

exports.user = async (req, res) => {
  const {id} = req.params;
  try{
    const user = await User.find({id});
    res.status(201).send({error: false, user});
  }catch(e){
    const {message} = e
    res.status(500).send({error: true, message});
  }
}

exports.deleteOne = async (req, res) => {
  const {id} = req.params;
  try{
    const user = await User.deleteOne({id});
    res.status(201).send({error: false, user});
  }catch(e){
    const {message} = e
    res.status(500).send({error: true, message});
  }
}

exports.update = async (req, res) => {
  const {id} = req.params
  const {name, surename, age} = req.body;
  try{
    const user = await User.updateOne({id}, {"$set": {name, surename, age}});
    res.status(201).send({error: false, user});
  }catch(e){
    const {message} = e
    res.status(500).send({error: true, message});
  }
}


exports.users = async (req, res) => {
  try{
    const users = await User.find({});
    res.status(201).send({error: false, users});
  }catch(e){
    const {message} = e
    res.status(500).send({error: true, message});
  }
}

exports.deleteAll = async (req, res) => {
  try{
    const users = await User.deleteMany({});
    res.status(201).send({error: false, users});
  }catch(e){
    const {message} = e
    res.status(500).send({error: true, message});
  }
}
