const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: function genUUID() {
        return uuidv4();
      },
    },
    name: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 12,
    },
    pass: {
      type: String,
      required: true,
      minlength: 4,
      validate: {
        validator: (v) => !Number(v),
        message: (props) => `${props.value} is contiens only numbers`,
      },
    },
    chats: [
      {
        chat: {
          type: String,
          ref: "Chat",
        },
        notification: {
          countNewMessages: {
            type: Number,
          },
        },
      },
    ],
    contacts: [
      {
        type: String,
        ref: "User",
      },
    ],
    connectionStatus: {
      type: "string",
      required: true,
      default: "disconnected",
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
