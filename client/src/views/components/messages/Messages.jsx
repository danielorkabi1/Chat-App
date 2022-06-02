import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Message from "./Message";
export default function Messages() {
  const {
    client: {
      user: { _id },
      selectedChat,
      chats:{byId}
    },
  } = useSelector((state) => state);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom,[byId])

  return (
    selectedChat && (
      <div className="all-messages">
          { 
              byId[selectedChat].chat.messages.map(
                (currentMessageInfo, i, array) => {
                  const messageInfo = array[array.length - 1 - i];
                  return (
                    <Message key={messageInfo._id} id={_id} messageInfo={messageInfo} />
                  );
                }
              )
            }
          <div ref={messagesEndRef} />
        </div>
    )
  );
}
