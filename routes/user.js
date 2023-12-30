const express = require("express");

const router = express.Router();
const Controller = require("../Controller/user");

router.post("/signup", Controller.userSignup);
router.post("/Signin", Controller.userSignin);

module.exports = router;
