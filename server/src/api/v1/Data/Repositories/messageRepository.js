const mongoose = require("mongoose");
const {Message} = require("../../Models/index");
class MessageRepositoryMongoQueries {
  constructor(session) {
    this.session = session;
  }
  //Messages Queries
  async GetMessagesOfChatById(chatId) {
    let messages = await Message.find({ chatId })
      .lean()
      .session(this.session)
      .sort({ timesent: -1 })
      .populate(this.PopulateMessageObject());
    return messages;
  }
  async InsertMessages(insertMessages) {
    let messages = await Message.insertMany(insertMessages, {
      session: this.session,
    });
    let messagesIds = messages.map((id) => id._id);
    messages = await Message.find({ _id: { $in: messagesIds } })
      .lean()
      .session(this.session)
      .populate(this.PopulateMessageObject());
    return messages;
  }
  async GetMessageById(messageId){
        let messages = await Message.findById(messageId)
          .lean()
          .session(this.session)
          .populate(this.PopulateMessageObject());
        return messages;
  }
  async InsertMessage(message) {
    let newMessage = await message.save({ session: this.session });
    newMessage = await this.GetMessageById(newMessage._id);
    return newMessage;
  }
  async PopulateMessage(message) {
    const newMessage = await Message.populate(
      message,
      this.PopulateMessageObject()
    );
    return newMessage;
  }
  PopulateMessageObject() {
    return {
      path: "sender",
      modal: "User",
      select: { _id: 1, email: 1 },
    };
  }
}
module.exports = MessageRepositoryMongoQueries;