const express = require("express");
const router = express.Router();
const {
  CreateGroupChat,
  LeaveGroup,
  JoinNewParticipantsToGroup,
  UpdateProfileImage,
} = require("../../Controllers/Chats/groupChatController");
const { upload } = require("../../Middleware/index");
router.post("/", upload.single("profileImage"), CreateGroupChat);
router.put("/leave", LeaveGroup);
router.put("/addparticipants", JoinNewParticipantsToGroup);
router.put("/profileImage/:chatId",upload.single("profileImage"), UpdateProfileImage);
module.exports = router;
