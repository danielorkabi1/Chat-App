const { UserService, Transaction } = require("../Services/index");
const { HttpStatusCodes, Api400Error } = require("../ErorHandlers/index");
async function UpdateNotification(req, res, next) {
  let transaction = new Transaction();
  try {
    const { userId } = req.params;
    if (!req.body) throw new Api400Error("params not found");
    const { chatId } = req.body;
    if (!chatId) throw new Api400Error("unvalid params chatId");
    await transaction.StartTransaction();
    const userService = new UserService(transaction.session);
    await userService.UpdateNotification(userId, chatId);
    await transaction.CommitTransaction();
    res.status(HttpStatusCodes.Created).send({ chatId });
  } catch (e) {
    await transaction.AbortTransaction();
    next(e);
  } 
}
async function ResetNotification(req, res, next) {
  let transaction = new Transaction();
  try {
    const { userId, chatId } = req.params;
    await transaction.StartTransaction();
    const userService = new UserService(transaction.session);
    await userService.ResetNotification(userId, chatId);
    await transaction.CommitTransaction();
    res.status(HttpStatusCodes.OK).json({ chatId });
  } catch (e) {
    await transaction.AbortTransaction();
    next(e);
  }
}
module.exports = {
  UpdateNotification,
  ResetNotification,
};
