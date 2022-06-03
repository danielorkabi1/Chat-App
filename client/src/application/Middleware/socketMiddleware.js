import { io } from "socket.io-client";
import {
  Connect,
  JoinNewGroup,
  ParticipantLeftChat,
  ParticipantStatusConnection,
  ReciveMessage,
  SendOfflineMessages,
  UpdateChatProfileImage,
  UpdateNewParticipants,
} from "../../Utils/Socket";
export default function Socketmiddleware() {
  let socket;
  let userId;
  return ({ dispatch, getState }) =>
  (next) =>
  (action) => {
      if (action.soecketEvent) {
        const {
          soecketEvent: {
            connect,
            dissconnect,
            emit,
            handleEvent,
            offlineData,
          },
          payload: data,
        } = action;
        const payload = data;
        if (offlineData) {
          const { eventName, params } = handleEvent;
          if (!socket || socket.disconnect) {
            socket =
              io("http://localhost:5000", {
                query: { id: getState().client.user._id },
              });
            SendOfflineMessages(params, socket, eventName, getState().client.chats.byId); 
          }
          
        }
        if (connect) {
          userId = payload._id;
          socket =
            socket ||
            io("http://localhost:5000", {
              query: { id: userId },
            });

            socket.on("connect", async () => {
              Connect(Object.values(getState().client.chats.byId), socket);
              socket.emit("userConnect");
            });
          socket.on("join-new-group", (data) =>{
            JoinNewGroup(
              data,
              socket,
              dispatch,
              getState().client.chats.byId,
              userId
            )
          }
          );
          socket.on("participant-left-chat", (data) =>
            ParticipantLeftChat(data, dispatch)
          );
          socket.on("update-new-paticipants", (data) =>
            UpdateNewParticipants(data, dispatch, userId)
          );
          socket.on("recive-a-message", (recivedMessage, chat) =>{
            ReciveMessage(
              recivedMessage,
              chat,
              getState().client.chats.byId,
              dispatch,
              userId
            )}
          );
          socket.on("updated-chat-profileImage", (data) => {
            UpdateChatProfileImage(data, dispatch);
          });
          socket.on("participant-status-connection", (data) => {
              ParticipantStatusConnection(
                getState().client.users.byId,
                data,
                dispatch
              );
          });
        }
        if (dissconnect) {
          socket.disconnect();
          socket.close();
          socket = null;
          userId = null;
        }
        if (emit) {
          const { eventName, params } = handleEvent;
          socket.emit(eventName, ...Object.values(params));
        }
      }
      next(action);
    };
}
