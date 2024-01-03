const express = require("express");

const router = express.Router();
const authentication = require("../Middlewares/authentication");
const Controller = require("../Controller/user");

router.post("/signup", Controller.userSignup);
router.post("/Signin", Controller.userSignin);
router.get("/", Controller.getmainpage);

module.exports = router;
