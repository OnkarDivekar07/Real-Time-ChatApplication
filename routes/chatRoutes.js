const express = require("express");
const router = express.Router();
const Controller = require("../Controller/chat");
const authentication = require("../Middlewares/authentication");

router.post(
  "/post-message",
  authentication.authorization,
  Controller.saveChatHistory
);
router.get(
  "/get-messages",
  authentication.authorization,
  Controller.getAllChatHistory
);
router.get(
  "/get-user",
  authentication.authorization,
  Controller.getcurrentuser
);

module.exports = router;
