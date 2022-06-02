const {MessageSrevice,UserService,Transaction,} = require("../../Services/index");
const { HttpStatusCodes, Api400Error } = require("../../ErorHandlers/index");

async function GetMessagesOfTheChats(req, res, next) {
  let transaction = new Transaction();
  try {
    if (!req.params) throw new Api400Error("params not found");
    const { chatId, userId } = req.params;
    if (!chatId || !userId) throw new Api400Error("unvalid params");
    await transaction.StartTransaction()
    const messageSrevice = new MessageSrevice(transaction.session);
    let messages = await messageSrevice.GetMessagesOfChatById(chatId);
    const userService = new UserService(transaction.session);
    await userService.ResetNotification(userId, chatId);
    await transaction.CommitTransaction();
    res.status(HttpStatusCodes.OK).json({ messages,chatId,userId });
  } catch (e) {
    await transaction.AbortTransaction();
    next(e)
  }
}

module.exports = {
  GetMessagesOfTheChats,
};
