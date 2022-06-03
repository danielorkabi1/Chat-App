const express= require('express')
const cors=require('cors')
const upload=require('./api/v1/Middleware/Multer/multer')
const mongoose = require("mongoose");
require('dotenv').config()
global.__rootPath = __dirname;
const {logErrorMiddleware,returnError,}=require('../src/api/v1/Middleware/index');
const { User } = require('./api/v1/Models');

const app=express()

mongoose.Promise = global.Promise;
const conn = mongoose.connection;
conn.on("error", () => console.error.bind(console, "connection error"));
conn.once("open", () => console.info("Connection to Database is successful"));
module.exports = { app, conn };

app.use(cors())
app.use(express.json());

app.use("/src/uploads", express.static("src/uploads"));
app.use("/api/chats", require("./api/v1/Routes/Chats/chatsRoutes"));
app.use("/api/chats/group", require("./api/v1/Routes/Chats/groupChatRoutes"));
app.use("/api/chats/private", require("./api/v1/Routes/Chats/privateChatRoutes"));
app.use("/api/users/notification", require("./api/v1/Routes/notificationRoutes"));
app.use("/api/users", require("./api/v1/Routes/userRoutes"))
app.use(logErrorMiddleware)
app.use(returnError)
   mongoose.connect(process.env.DB, ()=>{
    console.log("connected to DB");
    app.listen(process.env.PORT_SERVER, () => {
      console.log("listen");
    })
  },()=>{
  mongoose.connection.close()
})

require('./api/v1/Socket/socket')