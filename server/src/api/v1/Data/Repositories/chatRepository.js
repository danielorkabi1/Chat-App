const mongoose = require("mongoose");
const {Chat} = require("../../Models/index");
class ChatRepositoryMongoQueries {
  constructor(session) {
    this.session = session;
  }
  //Chat Queries
  async GetChatById(chatId) {
    let chat = await Chat.findById(chatId)
    .lean()
      .session(this.session)
      .populate(this.PopulateChatObject())
      .select(this.SelectPropperties());
    if (!chat) return null;
    return chat;
  }
  async GetPrivateChat(userId, participantId) {
    let newChat = await Chat.find({
      $and: [
        { participants: { $size: 2 } },
        {
          participants: {
            $all: [
              userId,
              participantId,
            ],
          },
        },
        { chatName: { $exists: false } },
      ],
    })
      .session(this.session)
      .populate(this.PopulateChatObject());
    if (newChat.length === 0) return null;
    return newChat[0].toObject();
  }
  async InsertChat(chatData) {
    let chat = await chatData.save({ session: this.session });
    chat = await this.GetChatById(chat._id);
    return chat;
  }
  async AddParticipantsToChat(_id, participants, lastMessageId) {
    await Chat.updateOne(
      { _id },
      {
        $push: { participants: { $each: participants } },
        $set: {
          lastMessage: lastMessageId,
        },
      },
      { session: this.session }
    );
  }
  async RemovePaerticipantsFromChat(_id, participants, lastMessageId) {
    await Chat.updateOne(
      { _id },
      {
        $pull: { participants: { $in: participants } },
        $set: {
          lastMessage: lastMessageId,
        },
      },
      { session: this.session }
    );
  }
  async UpdateLastMessage(chatId, lastMessageId) {
    await Chat.updateOne(
      { _id: chatId },
      { $set: { lastMessage: lastMessageId } },
      { session: this.session }
    );
    const chat=await this.GetChatById(chatId)
    return chat
  }
  async UpdateProfileImage(chatId, profileImage) {
    await Chat.updateOne(
      { _id: chatId },
      { $set: { profileImage } },
      { session: this.session }
    );
  }
  async PopulateChat(chat) {
    const populatedChat = await Chat.populate(
      chat,
      this.PopulateChatObject()
    ).select(this.SelectPropperties());
    return populatedChat;
  }
  PopulateChatObject() {
    return [
      {
        path: "participants",
        modal: "User",
        select: { name: 1, email: 1, profileImage: 1 },
      },
      {
        path: 'createdBy',
        modal:'User',
        select:{email:1,_id:1}
      },
    ];
  }
  SelectPropperties() {
    return {
      _id: 1,
      participants: 1,
      createdAt: 1,
      chatName: 1,
      createdBy: 1,
      createdBy: 1,
      profileImage: 1,
    };
  }
}
module.exports = ChatRepositoryMongoQueries;
