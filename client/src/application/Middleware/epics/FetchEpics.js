import { iif, of } from "rxjs";
import {
  FetchObservable,
  NewAction,
  TypeObserVable,
  TypeWithFilterObserVable,
} from "../../../Utils/epics";

const uri = `http://localhost:3010/api`;

export const SignInEpic = (action$, store$) => {
  return TypeObserVable({ action$, store$ }, "SIGN_IN", (action, store) => {
    return FetchObservable(
      { action, store },
      `${uri}/users/login?email=${action.payload.email}&pass=${action.payload.password}`,
      null,
      { event: "connect", eventName: null }
    );
  });
};

export const CreateNewPrivateChatIfNotExistsEpic = (action$, store$) => {
  return TypeObserVable(
    { action$, store$ },
    "CREATE_NEW_PRIVATE_CHAT_IF_NOT_EXISTS",
    (action, store) => {
      return FetchObservable({ action, store }, `${uri}/chats/private`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action.payload),
      });
    }
  );
};
export const GetUserConnectionStatusEpic = (action$, store$) => {
  return TypeObserVable(
    { action$, store$ },
    "GET_PRTICIPANT_CONNECTION_STATUS",
    (action, store) => {
      return FetchObservable(
        { action, store },
        `${uri}/users/connectionstatus/${action.payload.userId}`
      );
    }
  );
};
export const GetMessagesOfChatEpic = (action$, store$) => {
  return TypeObserVable(
    { action$, store$ },
    "GET_MESSAGES_OF_CHAT",
    (action, store) => {
      return FetchObservable(
        { action, store },
        `${uri}/chats/messages/${action.payload.chatId}/${action.payload.userId}`
      );
    }
  );
};
export const LeaveGroupEpic = (action$, store$) => {
  return TypeObserVable(
    { action$, store$ },
    "LEAVING_GROUP",
    (action, store) => {
      return FetchObservable(
        { action, store },
        `${uri}/chats/group/leave`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(action.payload),
        },
        { event: "emit", eventName: "exit-group" }
      );
    }
  );
};
export const UpdateChatProfileImageEpic = (action$, store$) => {
  return TypeObserVable(
    { action$, store$ },
    "UPDATE_CHAT_PROFILEIMAGE",
    (action, store) => {
      return FetchObservable(
        { action, store },
        `${uri}/chats/group/profileImage/${action.payload.chatId}`,
        {
          method: "PUT",
          body: action.payload.data,
        },
        { event: "emit", eventName: "update-chat-profileImage" }
      );
    }
  );
};
export const JoinNewParticipantsEpic = (action$, store$) => {
  return TypeObserVable(
    { action$, store$ },
    "ADDING_PARTICIPANTS_TO_GROUP",
    (action, store) => {
      return FetchObservable(
        { action, store },
        `${uri}/chats/group/addparticipants`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participants: action.payload.participants,
            chatId: action.payload.chatId,
          }), 
        },
        { event: "emit", eventName: "update-new-participants-to-group" }
      );
    }
  );
};
export const UpdateNotificationEpic = (action$, store$) =>
  TypeWithFilterObserVable(
    { action$, store$ },
    [
      "RECIVED_NEW_MESSAGE",
      "PARTICIPANT_LEFT_CHAT",
      "PARTICIPANTS_ADDED_TO_GROUP",
      "RECIVED_A_NEW_CHAT",
    ],
    (action, store) =>
      !store.client.selectedChat ||
      store.client.selectedChat !== action.payload.chatId,
    (action, store) => {
      action.type = "UPDATE_NOTIFICATION";
      return FetchObservable(
        { action, store },
        `${uri}/users/notification/${store.client.user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chatId: action.payload.chatId }), 
        }
      );
    }
  );
export const ResetNotificationEpic = (action$, store$) =>
  TypeObserVable({ action$, store$ }, "SELECT_CHAT", (action, store) => {
    return iif(
      () =>
        store.client.chats.byId[action.payload.chatId].notification
          .countNewMessages > 0,
      FetchObservable(
        { action, store },
        `${uri}/users/notification/${action.payload.userId}/${action.payload.chatId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
      of(
        NewAction(`${action.type}_SUCCESS`, {
          chatId: action.payload.chatId,
        })
      )
    );
  });
export const CreateUserEpic = (action$, store$) =>
  TypeObserVable({ action$, store$ }, "CREATE_USER", (action, store) => {
    return FetchObservable(
      { action, store },
      `${uri}/users/register`,
      {
        method: "POST",
        body: action.payload.data,
      },
      { event: "connect", eventName: null }
    );
  });

export const AddNewContactEpic = (action$, store$) =>
  TypeObserVable({ action$, store$ }, "ADD_NEW_CONTACT", (action, store) => {
    return FetchObservable(
      { action, store },
      `${uri}/users/contacts/${action.payload.userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: action.payload.participantEmail }), 
      }
    );
  });
export const CreateGroupChatEpic = (action$, store$) => {
  return TypeObserVable(
    { action$, store$ },
    "CREATING_A_NEW_GRUOP_CHAT",
    (action, store) => {
      return FetchObservable(
        { action, store },
        `${uri}/chats/group`,
        {
          method: "POST",
          body: action.payload.data, 
        },
        {
          event: "emit",
          eventName: "create-chat-group",
        }
      );
    }
  );
};
export const DeleteContactEpic = (action$, store$) => {
  return TypeObserVable(
    { action$, store$ },
    "DELETE_CONTACT",
    (action, store) =>
      FetchObservable(
        { action, store },
        `${uri}/users/contacts/removecontact`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...action.payload }), 
        }
      )
  );
};
