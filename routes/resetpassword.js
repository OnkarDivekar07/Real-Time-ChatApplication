const express = require("express");

const router = express.Router();
const authentication = require("../Middlewares/authentication");
const Controller = require("../Controller/password");

router.get(
  "/updatepassword/:resetpasswordid",
  authentication.authorization,
  Controller.updatepassword
);
router.get(
  "/resetpassword/:id",
  authentication.authorization,
  Controller.resetpassword
);
router.use(
  "/forgotpassword",
  authentication.authorization,
  Controller.forgotpassword
);
router.get("/", authentication.authorization, Controller.emailPage);

module.exports = router;
