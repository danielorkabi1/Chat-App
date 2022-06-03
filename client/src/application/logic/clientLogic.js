import produce from "immer";
import { current } from "@reduxjs/toolkit";
import {
  ConvertArrayIntoObj,
  ConvertChatsIntoObj,
  PutElementFirst,
  SharedGroupWithParticipant,
} from "../../Utils/redux/index";
export function SignInLogic(payload) {
  let state = null;
  if (payload) {
    const { contacts, chats, _id } = payload;
    const contactsObject = ConvertArrayIntoObj(contacts);
    const usersById = contactsObject.info;
    payload.contacts = contactsObject.ids;
    const chatsObg = ConvertChatsIntoObj(chats, _id);
    Object.assign(usersById, chatsObg.usersById);
    const chatsById = chatsObg.chatsById;
    const messagesById = chatsObg.messagesById;
    delete payload.chats;
    state = {
      user: payload,
      users: {
        byId: usersById,
        allIds: Object.keys(usersById),
      },
      chats: {
        byId: chatsById,
        allIds: Object.keys(chatsById),
      },
      messages: {
        byId: messagesById,
        allIds: Object.keys(messagesById),
      },
      selectedChat: null,
    };
  }
  return state;
}
export function SignOutLogic() {
  return null;
}
export function SelectedChatLogic(state, payload) {
  const { messages = undefined, chatId } = payload;
  return produce(state, (draftState) => {
    if (messages) {
      const messagesById = ConvertArrayIntoObj(messages).info;
      Object.assign(draftState.messages.byId, messagesById);
      draftState.messages.allIds.push(...Object.keys(messagesById));
      draftState.chats.byId[chatId].chat.messages = messages;
    }
    draftState.chats.byId[chatId].notification.countNewMessages = 0;
    draftState.selectedChat = chatId;
  });
}
export function AddNewChatLogic(state, payload) {
  const {chat}=payload
  payload.notification = {
    countNewMessages: state.user._id === chat.createdBy._id ? 0 : 1,
  };
  const newChat = JSON.parse(JSON.stringify(payload));

  return produce(state, (draftState) => {
    if (!draftState.chats.byId[newChat.chat._id]) {
      const chatsObg = ConvertChatsIntoObj([newChat], state.user._id);
      const chatById = chatsObg.chatsById;
      Object.assign(draftState.chats.byId, chatById);
      draftState.chats.allIds.push(newChat.chat._id);
      Object.assign(draftState.users.byId, chatsObg.usersById);
      draftState.users.allIds.push(...Object.keys(chatsObg.usersById));
      Object.assign(draftState.messages.byId, chatsObg.messagesById);
      draftState.messages.allIds.push(...Object.keys(chatsObg.messagesById));
    } else {
      Object.values(newChat.chat.participants).forEach((participant) => {
        if (!draftState.users.byId[participant._id]) {
          draftState.users.byId[participant._id] = participant;
          draftState.users.allIds.push(participant._id);
        }
      });
      const messagesObject = ConvertArrayIntoObj(newChat.chat.messages);
      Object.assign(draftState.messages.byId, messagesObject.info);
      draftState.messages.allIds.push(...Object.keys(messagesObject.ids));
    }
  });
}
export function AddNewContactLogic(state, payload) {
  const { contact } = payload;
  return produce(state, (state) => {
    state.user.contacts[contact._id] = contact._id;
    state.users.byId[contact._id] = contact;
    state.users.allIds.push(contact._id);
  });
}
export function AddNewMessageLogic(state, payload) {
  const { messages, chatId, userId } = payload;
  return produce(state, (draftState) => {
    if (draftState.chats.byId[chatId].chat.messages) {
      draftState.chats.byId[chatId].chat.messages.unshift(...messages);
      const messagesById = ConvertArrayIntoObj(messages).info;
      Object.assign(draftState.messages.byId, messagesById);
      draftState.messages.allIds.push(...Object.keys(messagesById));
    }
    draftState.chats.byId[chatId].chat.lastMessage = messages[0];
  });
}
export function LeaveGroupLogic(state, payload) {
  const { message, chatId, userId } = payload;
  return produce(
    AddNewMessageLogic(state, { messages: [message], chatId }),
    (draftState) => {
      delete draftState.chats.byId[chatId].chat.participants[userId];
      if (
        !draftState.user.contacts[userId] &&
        !draftState.user._id !== userId &&
        !SharedGroupWithParticipant(Object.values(draftState.chats.byId), userId)
      ) {
        delete draftState.users.byId[userId];
        draftState.users.allIds = draftState.users.allIds.filter(
          (id) => id !== userId
        );
      }
    }
  );
}
export function JoinNewParticipantsToGroupLogic(state, payload) {
  const { addedParticipnts:participants, joinMessages, chatId } = payload;
  return produce(
    AddNewMessageLogic(state, { messages: joinMessages, chatId }),
    (draftState) => {
      Object.assign(draftState.users.byId, participants);
      draftState.users.allIds.push(...Object.keys(participants));
     const newPrticipants = ConvertArrayIntoObj(Object.values(participants)).ids;
      Object.assign(
        draftState.chats.byId[chatId].chat.participants,
        newPrticipants
      );
    }
  );
}
export function UpdateNotificationLogic(state, payload) {
  const { chatId } = payload;
  return produce(state, (draftState) => {
    if (!draftState.selectedChat || draftState.selectedChat !== chatId) {
      draftState.chats.byId[chatId].notification.countNewMessages += 1;
    }
    PutElementFirst(draftState.chats.allIds, chatId);
  });
}
export function UpdateChatProfileImageLogic(state, payload) {
  const { chatId, profileImage } = payload;
  return produce(state, (draftState) => {
    draftState.chats.byId[chatId].chat.profileImage = profileImage;
  });
}
export function DeleteContactLogic(state, payload) {
  const { contactId } = payload;
  return produce(state, (draftState) => {
    delete draftState.user.contacts[contactId];
  });
}
export function UserConnectionStatusLogic(state, payload) {
  const { userId, connectionStatus } = payload;
  return produce(state, (draftState) => {
    draftState.users.byId[userId].connectionStatus = connectionStatus;
  });
}
