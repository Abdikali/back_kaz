const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const auth = require("../middlewares/auth");
const upload = require('../middlewares/upload');
const User = require("../models/user.model");

router.post("/", async (req, res) => {
  try{
    const user = await new User(req.body).save();
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({error: false, user, token});
  }catch(e){
    const {message} = e
    res.status(403).send({error: true,  true: message});
  }
});

router.post("/login", async (req, res) => {
  const {email, password} = req.body;
  try{
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.json({error: false, user, token});
  }catch(e){
    const {message} = e
    res.status(500).json({error: true, message});
  }
})

router.post("/logout", auth, async (req, res) => {
  try{
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.json({error: false, message: "Logged out"});
  }catch(e){
    const {message} = e;
    res.status(500).json({error: true, message});
  }
});

router.post("/logoutAll", auth, async (req, res) => {
  try{
    req.user.tokens = [];
    await req.user.save();
    res.json({error: false, message: "Logged out from all sessions"});
  }catch(e){
    const {message} = e;
    res.status(500).json({error: true, message});
  }
})

router.get("/me", auth, async (req, res) => {
  const {user} = req;
  res.send({error: false, user});
});

router.put("/me", auth, async (req, res) => {
  const id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(item => allowedUpdates.includes(item));
  if(!isValidOperation){
    res.status(400).json({error: true, message: "Updating non-existing block"})
  }
  try{
    const {user} = req;
    updates.forEach(item => user[item] = req.body[item]);
    await user.save();

    res.status(201).json({error: false, user});
  }catch(e){
    const {message} = e;
    res.status(403).json({error: true, message});
  }
})

router.delete("/me", auth, async (req, res) => {
  const id = req.user._id;
  try{
    await req.user.remove()
    res.json({error: false, user: req.user});
  }catch(e){
    const {message} = e;
    res.status(500).json({error: true, message})
  }
});

router.post("/me/avatar", auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.status(201).json({error: false, message: "Image uploaded"});
}, (error, req, res, next) => {
  const {message} = error;
  res.status(400).json({error: true, message});
});

router.delete("/me/avatar", auth, async(req, res) => {
  try{
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).json({error: false, message: "Image deleted"});
  }catch(e){
    const {message} = e;
    res.status(400).json({error: true, message});
  }
})

router.get("/:id/avatar", async (req, res) => {
  try{
    const user = await User.findById(req.params.id);
    if(!user || !user.avatar) throw new Error("Image or user is not found");
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  }catch(e){
    const {message} = e;
    res.status(404).json({error: true, message});
  }
});

module.exports = router;
