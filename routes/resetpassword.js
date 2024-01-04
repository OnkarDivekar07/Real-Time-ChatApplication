const express = require("express");
const router = express.Router();
const Controller = require("../Controller/password");

router.get("/updatepassword/:resetpasswordid", Controller.updatepassword);
router.get("/resetpassword/:id", Controller.resetpassword);
router.use("/forgotpassword", Controller.forgotpassword);
router.get("/", Controller.emailPage);

module.exports = router;
