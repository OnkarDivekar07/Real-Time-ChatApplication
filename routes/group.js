const express = require("express");
const router = express.Router();

const authentication = require("../Middlewares/authentication");
const controller = require("../Controller/group");

router.post(
  "/create-group",
  authentication.authorization,
  controller.createGroup
);
router.post(
  "/update-group",
  authentication.authorization,
  controller.updateGroup
);
router.get(
  "/get-mygroups",
  authentication.authorization,
  controller.getMygroups
);
router.get("/get-group", authentication.authorization, controller.getGroupbyId);
router.get(
  "/get-group-messages",
  authentication.authorization,
  controller.getGroupChatHistory
);
router.get(
  "/get-group-members",
  authentication.authorization,
  controller.getGroupMembersbyId
);

router.get("/get-users", authentication.authorization, controller.getAlluser);

router.get("/", authentication.authorization, controller.getgroupfile);

module.exports = router;
