import React from "react";
import { useSelector } from "react-redux";
import Chat from "./Chat"
export default function Chats() {
  const { byId, allIds } = useSelector((state) => state.client.chats);
  return (
    <div className="chats-continer">
      {allIds.map((chatId) => (
        <Chat key={chatId} chatInfo={byId[chatId]} />
      ))}
    </div>
  );
}
