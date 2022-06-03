import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetMessagesOfChatAction,
  SetSelectChatAction,
} from "../../../application/actions/clientActions";
import useGetParticipantChat from "../../../Utils/customHooks/useGetParticipantChat";
import CardStyle from "../CardStyle/CardStyle";
import DateTime from "./DateTime";
import LastMessage from "./LastMessage";
export default function Chat(props) {
  const { chatInfo } = props;
  const { participantDetails } = useGetParticipantChat(
    chatInfo.chat
  );
  const dispatch = useDispatch();
  const {
    selectedChat,
    user: { _id,contacts },
  } = useSelector((state) => state.client);
  async function GetMessagesOfTheChats(chat) {
    if (chat._id === selectedChat) return;
    if (chat.messages) {
      dispatch(SetSelectChatAction({ chatId: chat._id, userId: _id }));
    } else dispatch(GetMessagesOfChatAction({ chatId: chat._id, userId: _id }));
  }

  return (
    <div
      onClick={() => GetMessagesOfTheChats(chatInfo.chat)}
      className={
        selectedChat && selectedChat === chatInfo.chat._id
          ? "chat selected-chat"
          : "chat"
      }
    >
      <CardStyle
        onClick={() => {}}
        img={
          chatInfo.chat.chatName
            ? chatInfo.chat.profileImage
            : participantDetails.profileImage
        }
        mainSub={
          chatInfo.chat.chatName
            ? chatInfo.chat.chatName
            : contacts[participantDetails._id]
            ? participantDetails.name
            : participantDetails.email
        }
        seconderySub={
          chatInfo.chat.lastMessage ? (
            <LastMessage message={chatInfo.chat.lastMessage} />
          ) : null
        }
      />
      <div className="count-new-messages">
        <div>
          {chatInfo.notification.countNewMessages
            ? chatInfo.notification.countNewMessages
            : null}
        </div>
      </div>
      <DateTime
        className="chat-time"
        date={
          chatInfo.chat.lastMessage
            ? new Date(chatInfo.chat.lastMessage.timesent)
            : undefined
        }
      />
    </div>
  );
}
