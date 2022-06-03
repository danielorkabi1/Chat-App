const {
  MessageSrevice,
  UserService,
  ChatService,
  DeleteFile,
  Transaction,
} = require("../../Services/index");
const { HttpStatusCodes, Api400Error } = require("../../ErorHandlers/index");
const { Message, Chat } = require("../../Models/index");
const path=require('path')
async function CreateGroupChat(req, res, next) {
  let transaction = new Transaction();
  try {
    if (!req.body) throw new Api400Error("params not found");
    let { participants, chatName, createdBy } = req.body;
    if (!participants || !createdBy | !chatName)
      throw new Api400Error("unvalid params participants/createdBy/chatName");
    await transaction.StartTransaction();
    const chatService = new ChatService(transaction.session);
    participants = JSON.parse(participants);
    let profileImage = "src\\uploads\\anonymousProfile.jpg";
    if (req.file) profileImage = req.file.path;
    let newchat = new Chat({
      participants: Object.keys(participants),
      createdBy,
      lastMessage: null,
      chatName,
      profileImage,
    });
    newchat = await chatService.InsertChat(newchat);
    newchat.participants = Object.values(participants);
    const userService = new UserService(transaction.session);
    let joinMessages = await userService.JoinToGroupAndMessages(
      newchat._id,
      participants
    );
    const messageSrevice = new MessageSrevice(transaction.session);
    newchat.messages = await messageSrevice.InsertMessages(joinMessages);
    newchat.lastMessage = newchat.messages[newchat.messages.length - 1];
    await chatService.AddParticipantsToChat(
      newchat._id,
      Object.keys(participants),
      newchat.lastMessage._id
    );
    await transaction.CommitTransaction();
    res.status(HttpStatusCodes.Created).json({ chat: newchat });
  } catch (e) {
    await transaction.AbortTransaction();
    next(e);
  } 
}

async function LeaveGroup(req, res, next) {
  let transaction = new Transaction();
  try {
    if (!req.body) throw new Api400Error("params not found");
    const { chatId, userId } = req.body;
    if (!chatId || !userId)
      throw new Api400Error("unvalid params chatId/userId");
    await transaction.StartTransaction();
    const messageService = new MessageSrevice(transaction.session);
    let message = new Message({
      chatId,
      sender: userId,
      message: "has left!",
      notification: true,
    });
    message = await messageService.InsertMessage(message);
    const chatService = new ChatService(transaction.session);
    await chatService.RemovePaerticipantsFromChat(
      chatId,
      [userId],
      message._id
    );
    await transaction.CommitTransaction();
    res.status(HttpStatusCodes.OK).json({ message, chatId,userId });
  } catch (e) {
    await transaction.AbortTransaction();
    next(e);
  } 
}
async function JoinNewParticipantsToGroup(req, res, next) {
  let transaction = new Transaction();
  try {
    if (!req.body) throw new Api400Error("params not found");
    const { participants, chatId } = req.body;
    if (!chatId || !participants)
      throw new Api400Error("unvalid params chatId/participants");
    await transaction.StartTransaction();
    const userService = new UserService(transaction.session)
    let joinMessages = await userService.JoinToGroupAndMessages(
      chatId,
      participants
    );
    const messageSrevice = new MessageSrevice(transaction.session);
    joinMessages = await messageSrevice.InsertMessages(joinMessages);
    const chatSrevice = new ChatService(transaction.session);
    await chatSrevice.AddParticipantsToChat(
      chatId,
      Object.keys(participants),
      joinMessages[joinMessages.length - 1]
    )
    let chat=await chatSrevice.GetChatById(chatId)
    await transaction.CommitTransaction();
    res.status(HttpStatusCodes.OK).json({ joinMessages, addedParticipnts:participants, chatId,chat });
  } catch (e) {
    await transaction.AbortTransaction();
    next(e);
  } 
}
async function UpdateProfileImage(req,res,next){
 let transaction = new Transaction();
  try {
    const { chatId } = req.params
    const {prevProfileImage}=req.body
    if (!chatId )
      throw new Api400Error("unvalid params chatId");
    await transaction.StartTransaction();
    const chatSrevice=new ChatService(transaction.session)
    if (!req.file)
        throw new Api400Error("unvalid params chatId/participants");
    const profileImage = req.file.path;
    await chatSrevice.UpdateProfileImage(chatId, profileImage);
    if (profileImage !== "src\\uploads\\anonymousProfile.jpg")
      await DeleteFile(path.join(".", prevProfileImage));
    await transaction.CommitTransaction();
    res.status(HttpStatusCodes.OK).json({ chatId,profileImage});
  } catch (e) {
    await transaction.AbortTransaction();
    next(e);
  } 
}
module.exports = {
  CreateGroupChat,
  LeaveGroup,
  JoinNewParticipantsToGroup,
  UpdateProfileImage
};
