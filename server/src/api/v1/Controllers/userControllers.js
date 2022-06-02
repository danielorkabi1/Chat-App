  const { User } = require("../Models/index");
const {
  MessageSrevice,
  UserService,
  ChatService,
  Transaction,
} = require("../Services/index");
const { HttpStatusCodes, Api400Error } = require("../ErorHandlers/index");

async function GetUser(req, res, next) {
  let transaction = new Transaction();
  try {
    const { email, pass } = req.query;
    if (!req.body) throw new Api400Error("params not found");
    if (!email || !pass) throw new Api400Error("unvalid params email/pass");
    await transaction.StartTransaction();
    const userService = new UserService(transaction.session);
    let newUser = await userService.GetUserByEmailAndPass(email, pass);
    await transaction.CommitTransaction()
    res.status(HttpStatusCodes.OK).json(newUser);
  } catch (e) {
    await transaction.AbortTransaction();
    next(e);
  } 
}
async function CreateNewUser(req, res, next) {
  let transaction = new Transaction();
  try {
    if (!req.body) throw new Api400Error("params not found");
    const { email, password: pass, name } = req.body;
    if (!email || !pass || !name)
      throw new Api400Error("unvalid params email/pass");
    await transaction.StartTransaction();
    let profileImage = "src\\uploads\\anonymousProfile.jpg";
    if (req.file) profileImage = req.file.path;
    const user = new User({
      name,
      email,
      pass,
      profileImage,
    });
    const userService = new UserService(transaction.session);
    await userService.InsertUser(user);
    await transaction.CommitTransaction();
    res.status(HttpStatusCodes.Created).json(user);
  } catch (e) {
    await transaction.AbortTransaction();
    next(e);
  } 
}

async function AddContact(req, res, next) {
  let transaction = new Transaction();
  try {
    if (!req.body) throw new Api400Error("params not found");
    const { userId } = req.params;
    const { email } = req.body;
    if (!email || !userId) throw new Api400Error("unvalid params email/id");
    await transaction.StartTransaction();
    const userService = new UserService(transaction.session);
    const contact = await userService.AddNewContact(userId, email);
    res.status(HttpStatusCodes.OK).json({contact});
  } catch (e) {
    await transaction.AbortTransaction();
    next(e);
  } 
}
async function RemoveContact(req, res, next) {
  let transaction = new Transaction();
  try {
    if (!req.body) throw new Api400Error("params not found");
    const { userId, contactId } = req.body;
    if (!contactId || !userId) throw new Api400Error("unvalid params userId/contactId");
    await transaction.StartTransaction();
    const userService = new UserService(transaction.session);
    await userService.RemoveContact(userId,contactId)
    res.status(HttpStatusCodes.OK).json({ contactId });
  } catch (e) {
    await transaction.AbortTransaction();
    next(e);
  } 
}
async function GetUserConnectionStatus(req, res, next) {
  let transaction = new Transaction();
  try {
    if (!req.body) throw new Api400Error("params not found");
    const { userId } = req.params;
    if (!userId) throw new Api400Error("unvalid params userId");
    await transaction.StartTransaction();
    const userService = new UserService(transaction.session);
    const connectionStatus=await userService.GetUserConnectionStatus(userId);
    res.status(HttpStatusCodes.OK).json({ userId,connectionStatus });
  } catch (e) {
    await transaction.AbortTransaction();
    next(e);
  }
}
module.exports = {
  GetUser,
  CreateNewUser,
  AddContact,
  RemoveContact,
  GetUserConnectionStatus,
};
