const express = require("express");
const router = express.Router();
const {
  GetUser,
  CreateNewUser,
  AddContact,
  RemoveContact,
  GetUserConnectionStatus,
} = require("../Controllers/userControllers");
const { upload } = require("../Middleware/index");
router.get("/login", GetUser);
router.get("/connectionstatus/:userId", GetUserConnectionStatus);
router.post("/register", upload.single("profileImage"), CreateNewUser);
router.put("/contacts/removecontact", RemoveContact);
router.put("/contacts/:userId",AddContact );
module.exports=router