const express=require('express');
const router=express.Router()
const {
  GetMessagesOfTheChats,
} = require("../../Controllers/Chats/chatsController");
  router.get("/messages/:chatId/:userId", GetMessagesOfTheChats);
module.exports=router