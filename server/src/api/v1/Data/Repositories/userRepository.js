const {User} = require("../../Models/index");
const mongoose = require("mongoose");
const { Api404Error,Api400Error } = require("../../ErorHandlers/index");
class UserRepositoryMongoQueries {
  constructor(session) {
    this.session = session;
  }
  //User Queries
  async GetUserByEmailAndPass(email, pass) {
    const users = await User.find({ email, pass })
      .lean()
      .session(this.session)
      .populate(this.PopulateChats())
      .populate(this.PopulateContacts());
    if (users.length === 0) throw new Api404Error("caonnot find this user");
    return users[0];
  }
  async InsertUser(userData) {
    let user;
    try {
      await this.GetUserByEmail(userData.email);
      throw "the user already exists";
    } catch {
      user = await userData.save({ session: this.session });
      user = await this.GetUserByEmailAndPass(userData.email, userData.pass);
    }
    return user;
  }
  async GetUserById(userId) {
    const user = await User.findById(userId).session(this.session);
    return user;
  }
  async GetUserConnectionStatus(userId) {
    const user = await User.findById(userId)
    const connectionStatus = user.connectionStatus;
    return connectionStatus;
  }
  async GetUserByEmail(email) {
    const user = await User.find({ email })
      .lean()
      .session(this.session)
      .select({
        name: 1,
        _id: 1,
        email: 1,
        profileImage: 1,
      });
    if (user.length === 0) throw new Api404Error("caonnot find this user");
    return user[0];
  }
  async RemoveChatsFromUserChats(_id, chats) {
    await User.updateOne(
      { _id },
      { $pull: { chats: { $in: chats } } },
      { session: this.session }
    );
  }
  async UpdateNotification(userId, chatId) {
    await User.updateOne(
      { _id: userId, "chats.chat": chatId },
      { $inc: { "chats.$.notification.countNewMessages": 1 } },
      { session: this.session }
    );
  }
  async ResetNotification(userId, chatId) {
    await User.updateOne(
      { _id: userId, "chats.chat": chatId },
      { $set: { "chats.$.notification.countNewMessages": 0 } },
      { session: this.session }
    );
  }
  async RemoveContact(userId, contactId) {
    await User.updateOne(
      { _id: userId },
      { $pull: { contacts: contactId } },
      { session: this.session }
    );
  }
  async ChangeConnctionStatus(userId, connectionStatus) {
    await User.updateOne(
      { _id: userId },
      { $set: { connectionStatus } },
      { session: this.session }
    );
  }
  async AddChatToUser(newChatId, userId) {
    const user = await this.GetUserById(userId);
    user.chats ??= [];
    user.chats.unshift({
      chat: newChatId,
      notification: { countNewMessages: 1 },
    });
    await user.save({ session: this.session });
  }
  async AddNewContact(userId, contactEmail) {
    const user = await this.GetUserById(userId);
    const contact = await this.GetUserByEmail(contactEmail);
    if (!contact || contact._id.toString() === userId) {
      throw new Api400Error("userid cannot be his contact");
    }
    user.contacts ??= [];
    if (!user.contacts.includes(contact._id)) user.contacts.push(contact._id);
    await user.save({ session: this.session });
    return contact;
  }
  PopulateChats() {
    return {
      path: "chats.chat",
      model: "Chat",
      populate: [
        {
          path: "lastMessage",
          modal: "Message",
          populate: {
            path: "sender",
            modal: "User",
            select: { email: 1, _id: 1 },
          },
        },
        {
          path: "participants",
          modal: "User",
          select: { name: 1, profileImage: 1, email: 1 },
        },
      ],
    };
  }
  PopulateContacts() {
    return {
      path: "contacts",
      model: "User",
      select: { name: 1, email: 1, profileImage: 1 },
    };
  }
}
module.exports = UserRepositoryMongoQueries;
