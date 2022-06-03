const Chat = require("../Models/chat");
const http = require("http");
const { app } = require("../../../app");
const { Message } = require("../Models/index");
const { NotConnectedUsers } = require("./utils");
require("dotenv").config();
const {
  MessageSrevice,
  UserService,
  ChatService,
  Transaction,
} = require("../Services/index");
const mongoose = require("mongoose");

const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
server.listen(process.env.PORT_SOCKET, () => {
  console.log("im litening socket");
});
const connectedUsers = {};
const connectedSockets = {};
io.on("connection", async (socket) => {
  const userId = socket.handshake.query.id;
  socket.on("userConnect", async () => {
    connectedUsers[userId] = userId;
    connectedSockets[userId]=socket.id;
    socket.join(userId);
    const userService = new UserService();
    await userService.ChangeConnctionStatus(userId, "CONNECTED");
    socket.broadcast.emit("participant-status-connection", {
      participantId:userId,
      connectionStatus: "CONNECTED",
    });
  });
  socket.on("disconnect", async () => {
    delete connectedUsers[userId];
    delete connectedSockets[socket.id];
    const userService = new UserService();
    await userService.ChangeConnctionStatus(userId, "DISCONNECTED");
    socket.broadcast.emit("participant-status-connection", {
      participantId: userId,
      connectionStatus: "DISCONNECTED",
    });
  });
  socket.on("update-chat-profileImage", (chatId, profileImage) => {
    socket.broadcast.emit(
      "updated-chat-profileImage",
      { chatId, profileImage },
      socket.id
    );
  });
  socket.on("create-chat-group", (chat) => {
    socket.join(chat._id);
    for (let index = chat.messages.length - 1; index >= 0; index--) {
      const userId = chat.messages[chat.messages.length - 1].sender._id;
      socket.to(userId).emit("join-new-group", {chat});
    }
  });
  socket.on("join-chat", (chatId) => {
    socket.join(chatId);
  });
  socket.on(
    "send-a-message",
    async (chat, messageClient) => {
      let message = new Message({
        _id: messageClient._id,
        chatId: messageClient.chatId,
        sender: messageClient.sender._id,
        message: messageClient.message,
        timesent: messageClient.timesent,
      });
      let transaction = new Transaction()
      try {
        await transaction.StartTransaction();
        const messageService = 
        new MessageSrevice(transaction.session);
        message = await messageService.InsertMessage(message);
        const chatService = new ChatService(transaction.session);
        const userService = new UserService(transaction.session);
        let room;
        if (chat.chatName) {
          room = chat._id;
          NotConnectedUsers(
            Object.keys(chat.participants),
            connectedUsers,
            async function (userId) {
              await userService.UpdateNotification(userId, chat._id);
            }
          );
        } else {
          let participantId = Object.keys(chat.participants).find(
            (participant) => participant !== userId
          );
          const checkIfUserHasChat = await userService.CheckIfUserHasChat(
            participantId,
            chat._id
          );
          if (!chat.lastMessage && !checkIfUserHasChat) {
            await userService.AddChatToUser(chat._id, participantId);
            await userService.UpdateNotification(participantId, chat._id);
          }
          room = connectedSockets[participantId];
        }
        const messages=chat.messages.length===0?[message]:chat.messages
        chat=await chatService.UpdateLastMessage(chat._id, message._id);
        chat.messages=messages
        await transaction.CommitTransaction();
        socket.to(room).emit("recive-a-message", message, chat);
      } catch (e) {
        await transaction.AbortTransaction();
        socket.to(userId).emit("eror", e);
      } 
    }
  );
  socket.on("exit-group", (message, chatId, userId) => {
    socket.leave(message.chatId);
    socket
      .to(message.chatId)
      .emit("participant-left-chat", { message, chatId, userId });
  });
  socket.on(
    "update-new-participants-to-group",
    (joinMessages, addedParticipnts, chatId, chat) => {
      socket.to(chatId).emit("update-new-paticipants", {
        joinMessages,
        participants: addedParticipnts,
        chatId,
      });
      joinMessages.forEach((message) => {
        socket.to(message.sender._id).emit("join-new-group", {
          chat,
          joinMessages,
          participants: addedParticipnts,
        });
      });
    }
  );
});
