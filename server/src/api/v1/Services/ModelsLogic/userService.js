const { UserRepository } = require("../../Data/Repositories/index.js");
const { Message } = require("../../Models/index");
class UserService {
  constructor(session) {
    this.userRepository = new UserRepository(session);
  }
  async JoinToGroupAndMessages(chatId, participants) {
    const joinMessages = [];
    for (const participant of Object.values(participants)) {
      const message = new Message({
        chatId,
        sender: participant._id,
        message: "has join!",
        notification: true,
      });
      joinMessages.unshift(message);
      await this.userRepository.AddChatToUser(chatId, participant._id);
      await this.UpdateNotification(participant._id, chatId);
    }

    return joinMessages;
  }
  async GetUserByEmailAndPass(email, pass) {
    return await this.userRepository.GetUserByEmailAndPass(email, pass);
  }
  async InsertUser(userData) {
    return await this.userRepository.InsertUser(userData);
  }
  async GetUserById(userId) {
    return await this.userRepository.GetUserById(userId);
  }
  async GetUserByEmail(email) {
    return await this.userRepository.GetUserByEmail(email);
  }
  async RemoveChatsFromUserChats(_id, chats) {
    return await this.userRepository.RemoveChatsFromUserChats(_id, chats);
  }
  async UpdateNotification(userId, chatId) {
    return await this.userRepository.UpdateNotification(userId, chatId);
  }
  async ResetNotification(userId, chatId) {
    return await this.userRepository.ResetNotification(userId, chatId);
  }
  async AddChatToUser(newChatId, userId) {
    return await this.userRepository.AddChatToUser(newChatId, userId);
  }
  async AddNewContact(userId, contactEmail) {
    return await this.userRepository.AddNewContact(userId, contactEmail);
  }
  async CheckIfUserHasChat(userId, chatId) {
    const user = await this.userRepository.GetUserById(userId);
    return user.chats.some((chatInfo) => chatInfo.chat._id === chatId);
  }
  async RemoveContact(userId, contactId) {
    return await this.userRepository.RemoveContact(userId, contactId);
  }
  async ChangeConnctionStatus(userId, connectionStatus){
    return await this.userRepository.ChangeConnctionStatus(userId, connectionStatus)
  }
  async GetUserConnectionStatus(userId){
    return await this.userRepository.GetUserConnectionStatus(userId)
  }
}
module.exports=UserService