const express = require("express");
const router = express.Router();
const Controller = require("../Controller/chat");
const multerMiddleware = require("../Middlewares/multer");
const upload = multerMiddleware.multer.single("image");
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

router.post(
  "/post-image",
  authentication.authorization,
  upload,
  Controller.saveChatImages
);

module.exports = router;
