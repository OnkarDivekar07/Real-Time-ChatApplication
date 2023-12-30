const express = require("express");
const router = express.Router();
const Controller = require("../Controller/mainpageController");

router.get("/", Controller.mainpage);
router.use("/", Controller.errorpage);

module.exports = router;
