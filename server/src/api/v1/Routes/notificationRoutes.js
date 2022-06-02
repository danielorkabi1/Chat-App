const express = require("express");
const router = express.Router();
const {
  UpdateNotification,
  ResetNotification,
} = require("../Controllers/notificationControllers");
router.put("/:userId",UpdateNotification);
router.put("/:userId/:chatId", ResetNotification);
module.exports=router