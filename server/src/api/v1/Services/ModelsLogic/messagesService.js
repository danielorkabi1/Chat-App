const {MessageRepository}=require('../../Data/Repositories/index')
class MessageService {
  constructor(session) {
    this.MessageRepository = new MessageRepository(session);
  }
  async GetMessagesOfChatById(chatId) {
    return await this.MessageRepository.GetMessagesOfChatById(chatId);
  }
  async InsertMessages(insertMessages) {
    return await this.MessageRepository.InsertMessages(insertMessages);
  }
  async InsertMessage(message) {
    return await this.MessageRepository.InsertMessage(message);
  }
  async PopulateMessage(message) {
    return await this.MessageRepository.PopulateMessage(message);
  }
}
module.exports=MessageService