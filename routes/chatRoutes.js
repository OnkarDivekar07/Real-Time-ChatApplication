const express = require("express");

const router = express.Router();

const Controller = require("../Controller/chat");
const authentication = require("../Middlewares/authentication");

router.post(
  "post-message",
  authentication.authorization,
  Controller.saveChatHistory
);

module.exports = router;
