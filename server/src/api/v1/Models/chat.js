const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");const Schema = mongoose.Schema;
const chatSchema = new Schema(
  {
    _id: {
      type: String,
      default: function genUUID() {
        return uuidv4();
      },
    },
    chatName: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String,
      required: false,
    },
    createdBy: {
      type: String,
      required: true,
      ref: "User",
    },
    participants: [
      {
        type: String,
        ref: "User",
      },
    ],
    lastMessage: {
      type: String,
      ref: "Message",
    },
  },
  { timestamps: true }
);
const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
