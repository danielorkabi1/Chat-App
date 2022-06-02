const { ChatRepository  } = require("../../Data/Repositories/index");
const {Chat} = require("../../Models/index");
class ChatService {
  constructor(session) {
    this.chatRepository = new ChatRepository(session);
  }
  async CreateNewChat(participants, createdBy, chatName, profileImage) {
    const chat = new Chat({
      participants,
      createdBy,
      lastMessage: null,
    }).toObject();
    if (chatName) {
      chat.chatName = chatName;
      chat.profileImage = profileImage;
    }
    let newChat = await this.chatRepository.InsertChat(chat);
    return newChat;
  }
  async GetPrivateChat(participants, userId) {
    const participantId = participants.filter(
      (participant) => participant !== userId
    )[0];
    let newchat = await this.chatRepository.GetPrivateChat(
      userId,
      participantId
    );
    if (!newchat) {
      let newChat = new Chat({
        createdBy: userId,
        participants,
        lastMessage: null,
      });
      newchat = await this.chatRepository.InsertChat(newChat);
    }
    //TODO:we need to populate this and reset notification when we get the chat on the action
    //messages = await dataService.GetMessagesOfChatById(newchat._id);
    //await dataService.ResetNotification(userId, chatId);
    // newchat.messages = messages;
    // newchat.lastMessage = messages[0];
    //TODO:we need to AddChatToUser  when we get the chat on the action
    // await dataService.AddChatToUser(newchat._id, userId);

    return newchat;
  }
  async GetChatById(chatId) {
    return await this.chatRepository.GetChatById(chatId);
  }
  async InsertChat(chatData) {
    return await this.chatRepository.InsertChat(chatData);
  }
  async AddParticipantsToChat(_id, participants, lastMessageId) {
    return await this.chatRepository.AddParticipantsToChat(
      _id,
      participants,
      lastMessageId
    );
  }
  async RemovePaerticipantsFromChat(_id, participants, lastMessageId) {
    return await this.chatRepository.RemovePaerticipantsFromChat(
      _id,
      participants,
      lastMessageId
    );
  }
  async UpdateLastMessage(chatId, lastMessageId) {
    return await this.chatRepository.UpdateLastMessage(chatId, lastMessageId);
  }
  async PopulateChat(chat) {
    return await this.chatRepository.PopulateChat(chat);
  }
  async UpdateProfileImage(chatId, profileImage) {
    await this.chatRepository.UpdateProfileImage(chatId, profileImage);
  }
  CheckIfCreaterOfChat(chat, user) {
    if (chat.createdBy._id === user) {
      return true;
    }
    return false;
  }

}
module.exports=ChatService