const express = require("express");

const router = express.Router();
const Controller = require("../Controller/user");

router.post("/signup", Controller.userSignup);

module.exports = router;
