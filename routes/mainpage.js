const express = require("express");
const router = express.Router();
const Controller = require("../Controller/mainpage");

router.get("/", Controller.mainpage);
router.use("/", Controller.errorpage);

module.exports = router;
