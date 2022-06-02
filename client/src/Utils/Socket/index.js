import {
  RecivedANewChatAction,
  RecivedNewMessageAction,
  ParticipantsAddedToGroupAction,
  ParticipantLeftChatAction,
  UpdatedChatProfileImageAction,
  ChangeParticipantConnctionStatusAction,
  AddingParticipantsToGroupAction,
} from "../../application/actions/clientActions";
import IndexDB from "../IndexDB/IndexDBClass";

export function Connect(chats, socket) {
  if (chats) {
    chats.forEach((chatInfo) => {
      if (chatInfo.chat.chatName) socket.emit("join-chat", chatInfo.chat._id);
    });
  }
}
export function JoinNewGroup(
  { chat, joinMessages, participants: addedParticipnts },
  socket,
  dispatch,
  chatsById,
  userId
) {
  const chatId = chat._id;
  socket.emit("join-chat", chatId);
  if (chatsById[chatId]) {
    return dispatch(
      ParticipantsAddedToGroupAction({
        joinMessages,
        addedParticipnts,
        chatId,
        userId,
      })
    );
  }
  dispatch(RecivedANewChatAction({ chat, chatId: chat._id }));
}
export function ParticipantLeftChat({ message, chatId, userId }, dispatch) {
  dispatch(
    ParticipantLeftChatAction({
      message,
      chatId,
      userId,
    })
  );
}
export function UpdateNewParticipants(data, dispatch, userId) {
  dispatch(ParticipantsAddedToGroupAction({ ...data, userId }));
}
export function ReciveMessage(
  recivedMessage,
  chat,
  chatsById,
  dispatch,
  userId
) {
  const { chatId } = recivedMessage;
  if (!chatsById[chatId]) {
    dispatch(RecivedANewChatAction({ chat, chatId }));
    return;
  }
  dispatch(
    RecivedNewMessageAction({ messages: [recivedMessage], chatId, userId })
  );
}
export function UpdateChatProfileImage({ chatId, profileImage }, dispatch) {
  dispatch(UpdatedChatProfileImageAction({ chatId, profileImage }));
}
export function ChangeParticipantConnctionStatus(
  { participantId, connectionStatus },
  users,
  dispatch
) {
  if (users[participantId]) {
    dispatch(
      ChangeParticipantConnctionStatusAction({
        userId: participantId,
        connectionStatus,
      })
    );
  }
}
export function SendOfflineMessages(params,socket,eventName,chats) {
  for (let index =0; index < params.length; index++) {
    const param = params[index];
    const indexDB = new IndexDB();
    indexDB.OpenDB("ServiceWorkerDB", 1).then(() => {
      indexDB.Remove("messages", param._id).then(()=>{
            socket.emit(eventName, chats[param.chatId].chat, param);
      })
    });
  }
}

export function ParticipantStatusConnection(users, data, dispatch) {
  const { participantId, connectionStatus } = data;
  if (users[participantId]) {
    dispatch(
      ChangeParticipantConnctionStatusAction({
        userId: participantId,
        connectionStatus,
      })
    );
  }
}