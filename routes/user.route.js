const express = require('express');
const router = express.Router();
const controller = require("../controllers/user.controller");
router.route("/")
.get(controller.users)
.post(controller.create)
.delete(controller.deleteAll)
// .get((req, res) => )


router.route("/:id")
.get(controller.user)
.delete(controller.deleteOne)
.put(controller.update)


module.exports = router;
