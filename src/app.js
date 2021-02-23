const express = require('express');
const mongoose = require('mongoose');
const userRouter = require("../routes/user.route")
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({message: "Get method"});
});

app.use("/users", userRouter);

mongoose.connect("mongodb://127.0.0.1:27017/users", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected"))
.catch(e => console.log("Failed to connect"));

app.listen(3000, () => {
  console.log("Server started");
})
