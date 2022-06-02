const mongoose=require('mongoose')
const { v4: uuidv4 } = require("uuid");const Schema=mongoose.Schema;
const nessageSchema = new Schema(
  {
    _id: {
      type: String,
      default: function genUUID() {
        return uuidv4();
      },
    },
    chatId: {
      type: String,
      ref: "Chat",
    },
    sender: {
      type: String,
      ref: "User",
      required: true,
    },
    timesent: {
      type: Date,
      default: () => Date.now(),
      immutable: true,
    },
    message: {
      type: String,
      require: true,
      immutable: true,
    },
    notification: {
      type: Boolean,
      immutable: true,
      default: false,
    },
  },
  { timestamps: true }
);
const nessage =mongoose.model('Message',nessageSchema)
module.exports=nessage