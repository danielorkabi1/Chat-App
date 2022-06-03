const {
  MessageSrevice,
  UserService,
  ChatService,
  Transaction,
} = require("../../Services/index");
const { HttpStatusCodes, Api400Error } = require("../../ErorHandlers/index");

async function CreateNewPrivateChatIfNotExists(req, res, next) {
  let transaction = new Transaction();
  try {
    if (!req.body) throw new Api400Error("params not found");
    const { userId, participants } = req.body;
    if (!participants  || !userId)
      throw new Api400Error("unvalid params participants/userId");
    await transaction.StartTransaction();
    const chatService = new ChatService(transaction.session);
    let chat = await chatService.GetPrivateChat(
      participants,
      userId
    )
    const messageSrevice = new MessageSrevice(transaction.session);
    let messages = await messageSrevice.GetMessagesOfChatById(chat._id);
    chat.lastMessage = messages[0];
    chat.messages = messages;
    await transaction.CommitTransaction();
    await transaction.StartTransaction();
    const userService = new UserService(transaction.session);
    if(!chatService.CheckIfCreaterOfChat(chat,userId))
        await userService.UpdateNotification(userId,chat._id)
    await userService.AddChatToUser(chat._id, userId);
    await transaction.CommitTransaction();
    res.status(HttpStatusCodes.Created).json({ chat });
  } catch (e) {
    await transaction.AbortTransaction();
    next(e)
  } 
}

module.exports = {
  CreateNewPrivateChatIfNotExists,
};
