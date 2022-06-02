export function ConvertArrayIntoObj(array) {
  return array?array.reduce(
    (prevItem, item) => {
      const itemInfo = { ...item };
      return {
        info: { ...prevItem.info, [item._id.toString()]: itemInfo },
        ids: { ...prevItem.ids, [item._id.toString()]: item._id.toString() },
      };
    },
    { info: {}, ids: {} }
  ):{};
}
export function ConvertChatsIntoObj(chats, userId) {
  const usersById = {};
  const messagesById = {};
  const chatsById =chats? chats.reduce((prev, chatInfo) => {
    if(chatInfo.chat){
    const participantsObject = ConvertArrayIntoObj(chatInfo.chat.participants);
    chatInfo.chat.participants = participantsObject.ids;
    Object.assign(usersById, participantsObject.info);
    }
    if (chatInfo.chat.messages) {
      const messagesObject = ConvertArrayIntoObj(chatInfo.chat.messages);
      Object.assign(messagesById, messagesObject.info);
    }
    return { ...prev, [chatInfo.chat._id.toString()]: chatInfo };
  }, {}):{};
  return { chatsById, usersById,messagesById };
}
export function SharedGroupWithParticipant(chats,participantId){
  return chats.some((chatInfo)=>chatInfo.chat.participants[participantId])
}
export function PutElementFirst(array,element){
      const index = array.indexOf(element);
      if (index > -1) {
        array.splice(index, 1); 
      }
      array.unshift(element);
}