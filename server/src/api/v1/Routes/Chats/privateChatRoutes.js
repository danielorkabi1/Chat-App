const express = require("express");
const router = express.Router();
const {
  CreateNewPrivateChatIfNotExists,
} = require("../../Controllers/Chats/privateChatController");
router.post("/", CreateNewPrivateChatIfNotExists);
module.exports = router;
